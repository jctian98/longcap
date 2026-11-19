#!/usr/bin/env python3
"""Check the restored demo's media, routes, links, and browser interactions."""
import argparse
import functools
import hashlib
import json
import threading
from datetime import datetime, timezone
from http.server import ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT
RESOURCES = {
    "https://arxiv.org/abs/2611.11125",
    "https://github.com/jctian98/longcap-code",
    "https://github.com/jctian98/longcap-code/blob/main/docs/quickstart.md",
    "https://huggingface.co/JinchuanTian/LongCap-35B-A3B-FP8",
    "https://huggingface.co/JinchuanTian/LongCap-35B-A3B",
    "https://huggingface.co/datasets/JinchuanTian/LongCapBench-TAC-Long",
}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def static_checks():
    manifest = json.loads((ROOT / "scripts/demo-asset-manifest.json").read_text())
    for relative, expected in manifest["files"].items():
        path = SITE / relative
        require(path.is_file() and not path.is_symlink(), f"Missing original asset: {relative}")
        require(path.stat().st_size == expected["bytes"], f"Changed asset size: {relative}")
        require(hashlib.sha256(path.read_bytes()).hexdigest() == expected["sha256"], f"Changed original asset: {relative}")
    catalog = json.loads((SITE / "catalog.json").read_text())
    entries = catalog["examples"]
    require(len(entries) == 14, "The demo must retain all 14 examples")
    require(sum(e["kind"] == "long" for e in entries) == 4, "The demo must retain four long recordings")
    expected_files = set(manifest["files"]) | {".nojekyll", "404.html", "app.js", "favicon.svg", "index.html", "robots.txt", "styles.css", "links.json"}
    for entry in entries:
        route = f'examples/{entry["id"]}/index.html'
        expected_files.add(route)
        require((SITE / route).is_file(), f"Missing example route: {route}")
        require(len(entry["audioSources"]) == 2, f'Missing audio fallback: {entry["id"]}')
        for source in entry["audioSources"]:
            require(source["src"] in manifest["files"], f'Unpinned audio: {source["src"]}')
        payload = json.loads((SITE / entry["data"]).read_text())
        require(set(payload["predictions"]) == {"longcap-35b", "longcap-122b"}, "Original model panels must be preserved")
        require(bool(payload["reference"]["events"]), "Missing reference events")
    actual_files = {str(p.relative_to(SITE)) for p in SITE.rglob("*")
                    if p.is_file() and not any(part.startswith(".") and part != ".nojekyll" for part in p.relative_to(SITE).parts)
                    and p.relative_to(SITE).parts[0] not in {"scripts", "README.md", "LICENSE"}}
    require(actual_files == expected_files, f"Unexpected/missing deployed files: {actual_files ^ expected_files}")
    for path in [SITE / name for name in expected_files if name.endswith(".html")]:
        html = path.read_text()
        require("media-src 'self' blob:" in html, f"Media CSP blocks playback: {path.name}")
    links = json.loads((SITE / "links.json").read_text())
    require(RESOURCES == set(links.values()), "Missing or unexpected release resources")
    require('/longcap/' in (SITE / '404.html').read_text(), "404 must preserve the project prefix")
    return catalog, {"passed": True, "original_assets": len(manifest["files"]), "public_files": len(actual_files), "examples": len(entries)}


def media_state(page):
    return page.locator("audio").evaluate("""a => ({time:a.currentTime,duration:a.duration,
        paused:a.paused,seeking:a.seeking,ready:a.readyState,source:a.currentSrc,
        muted:a.muted,volume:a.volume,error:a.error?.code??null})""")


def context_check(page, payload):
    snapshot = page.evaluate("""() => ({time:document.querySelector('audio').currentTime,
        panels:Array.from(document.querySelectorAll('.event-column')).map(c=>({id:c.dataset.panel,
        current:Array.from(c.querySelectorAll('.live-current-content .event-card')).map(e=>e.dataset.event),
        linked:Array.from(c.querySelectorAll('.live-linked-content .event-card')).map(e=>e.dataset.event)}))})""")
    require(len(snapshot["panels"]) == 3, "Missing comparison panel")
    for panel in snapshot["panels"]:
        data = payload["reference"] if panel["id"] == "reference" else payload["predictions"][panel["id"]]
        events = {str(e["id"]): e for e in data["events"]}
        active = {key for key, e in events.items() if e["start"] <= snapshot["time"] < e["end"]}
        linked, visited, queue = set(), set(), list(active)
        while queue:
            key = queue.pop()
            if key in visited:
                continue
            visited.add(key)
            for ancestor in events[key].get("ancestors", []):
                target = str(ancestor.get("target"))
                if ancestor.get("status") == "valid" and target in events and target != key and target not in active:
                    linked.add(target)
                    queue.append(target)
        require(active == set(panel["current"]), f'Current events out of sync: {panel["id"]}')
        require(linked == set(panel["linked"]), f'Linked context out of sync: {panel["id"]}')
    return snapshot


def browser_checks(catalog, base, output):
    from playwright.sync_api import sync_playwright

    report = {"checked_utc": datetime.now(timezone.utc).isoformat(), "base": base, "cases": [], "errors": []}
    output.mkdir(parents=True, exist_ok=True)
    require(not output.resolve().is_relative_to(SITE.resolve()), "Browser reports must stay outside demo/")

    def save():
        (output / "browser-check.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
            report["browser"] = browser.version
            context = browser.new_context(viewport={"width": 1440, "height": 1000})
            page = context.new_page()
            page.on("pageerror", lambda error: report["errors"].append(str(error)))
            page.goto(base, wait_until="networkidle", timeout=60000)
            require(page.locator(".long-grid .example-card").count() == 4, "Missing long examples")
            require(page.locator(".short-grid .short-card").count() == 10, "Missing short examples")
            links = page.locator(".hero-resources a").evaluate_all("xs => xs.map(x=>({url:x.href,rel:x.rel,target:x.target}))")
            require({x["url"] for x in links} == RESOURCES, "Homepage resource links differ")
            require(all(x["target"] == "_blank" and "noopener" in x["rel"] for x in links), "Resource link navigation")
            page.screenshot(path=str(output / "homepage-desktop.png"), full_page=True)
            page.set_viewport_size({"width": 390, "height": 844})
            require(page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Homepage overflows mobile viewport")
            page.screenshot(path=str(output / "homepage-mobile.png"), full_page=True)
            page.set_viewport_size({"width": 1440, "height": 1000})
            for entry in catalog["examples"]:
                slug = entry["id"]
                print(json.dumps({"example": slug, "stage": "browser"}), flush=True)
                page.goto(base + f"examples/{slug}/", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_selector(".audio-play-toggle", timeout=60000)
                page.wait_for_function("() => document.querySelector('audio').readyState > 0", timeout=60000)
                initial = media_state(page)
                require(abs(initial["duration"] - entry["duration"]) < .2, f"Audio duration: {slug}")
                page.locator(".audio-play-toggle").click()
                page.wait_for_function("() => {const a=document.querySelector('audio'); return !a.paused && a.currentTime > .3;}", timeout=60000)
                playing = media_state(page)
                require(not playing["muted"] and playing["volume"] > 0 and playing["error"] is None, f"Playback failed: {slug}")
                page.locator(".audio-play-toggle").click()
                target = round(entry["duration"] * .7, 2)
                field = page.locator(".time-field input")
                field.fill(str(target))
                field.press("Enter")
                page.wait_for_function("t => {const a=document.querySelector('audio');return !a.seeking && Math.abs(a.currentTime-t)<.3 && a.paused;}", arg=target, timeout=60000)
                page.locator(".audio-play-toggle").click()
                page.wait_for_function("t => {const a=document.querySelector('audio');return !a.paused && a.currentTime>t+.3;}", arg=target, timeout=60000)
                page.locator(".audio-play-toggle").click()
                page.locator("audio").evaluate("a => a.dispatchEvent(new Event('timeupdate'))")
                payload = json.loads((SITE / entry["data"]).read_text())
                sync = context_check(page, payload)
                footer_links = page.locator(".footer-resources a").evaluate_all("xs=>xs.map(x=>x.href)")
                require(set(footer_links) == RESOURCES, f"Missing example resources: {slug}")
                report["cases"].append({"id": slug, "passed": True, "initial": initial, "playing": playing, "seek_target": target, "resumed": media_state(page), "context": sync})
                save()
                if slug == "en-film":
                    page.screenshot(path=str(output / "example-desktop.png"), full_page=True)
                    page.set_viewport_size({"width": 390, "height": 844})
                    require(page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Example overflows mobile viewport")
                    page.screenshot(path=str(output / "example-mobile.png"), full_page=True)
                    page.set_viewport_size({"width": 1440, "height": 1000})
            # A unavailable MP3 must automatically fall back to the saved WebM.
            page.route("**/audio/*.mp3", lambda route: route.abort())
            page.goto(base + "examples/short-01/", wait_until="domcontentloaded", timeout=60000)
            page.wait_for_function("() => {const a=document.querySelector('audio');return a && a.readyState>0 && a.currentSrc.endsWith('.webm');}", timeout=60000)
            page.locator(".audio-play-toggle").click()
            page.wait_for_function("() => {const a=document.querySelector('audio');return !a.paused && a.currentTime>.3;}", timeout=60000)
            report["webm_fallback"] = media_state(page)
            response = page.goto(base + "missing/nested/page", wait_until="domcontentloaded", timeout=60000)
            require(response.status == 404, "Missing routes must return 404")
            require(page.locator("a.button").get_attribute("href") == "/longcap/", "404 link points to the wrong project")
            require(not report["errors"], "Browser JavaScript errors")
            context.close()
            browser.close()
        report["passed"] = True
    finally:
        save()
    return {"passed": report["passed"], "cases": len(report["cases"]), "output": str(output)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", action="store_true")
    parser.add_argument("--base", help="Test a deployed site instead of starting the local preview")
    parser.add_argument("--output", type=Path, default=Path("/tmp/longcap-demo-check"))
    args = parser.parse_args()
    catalog, result = static_checks()
    print(json.dumps({"static": result}), flush=True)
    if args.browser:
        server = None
        try:
            if args.base:
                base = args.base.rstrip("/") + "/"
            else:
                from serve_demo import Handler
                server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(SITE)))
                threading.Thread(target=server.serve_forever, daemon=True).start()
                base = f"http://127.0.0.1:{server.server_port}/longcap/"
            print(json.dumps({"browser": browser_checks(catalog, base, args.output)}), flush=True)
        finally:
            if server:
                server.shutdown()
                server.server_close()


if __name__ == "__main__":
    main()
