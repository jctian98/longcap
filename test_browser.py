#!/usr/bin/env python3
"""Exercise the local static demo in Chromium; writes only private test receipts.

Requires Playwright and its Chromium installation. No deployment or external
requests. Optional original WAVs are selected through the browser's local picker.
"""
import argparse
import functools
import http.server
import json
import threading
from datetime import datetime, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright


def run(args):
    site = args.site.resolve()
    output = args.output.resolve()
    if output == site or output.is_relative_to(site):
        raise ValueError("Browser receipts and fixtures must stay outside the public site")
    output.mkdir(parents=True, exist_ok=True)
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *unused):
            pass
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(site)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    catalog = json.loads((site / "catalog.json").read_text())
    errors, requests, checks = [], [], []
    completed = False
    def check(condition, name, detail=None):
        checks.append({"name": name, "passed": bool(condition), "detail": detail})
        if not condition:
            raise AssertionError(name + ": " + str(detail))
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
            for width in (1440, 390):
                context = browser.new_context(viewport={"width": width, "height": 1000})
                page = context.new_page()
                page.on("pageerror", lambda e: errors.append(str(e)))
                def guard(route):
                    req = route.request
                    requests.append({"url": req.url, "method": req.method, "type": req.resource_type})
                    if req.url.startswith(base + "/") and req.method in {"GET", "HEAD"}:
                        route.continue_()
                    elif req.url.startswith("blob:" + base):
                        route.continue_()
                    else:
                        route.abort()
                        errors.append("Blocked unexpected request: " + req.url)
                context.route("**/*", guard)
                page.goto(base, wait_until="networkidle")
                page.wait_for_selector(".event")
                check(page.locator(".recording-card").count() == 4, f"{width}: exactly four recordings")
                check(page.locator("#error").is_hidden(), f"{width}: no load error")
                for entry in catalog["examples"]:
                    key = entry["key"]
                    data = json.loads((site / entry["data"]).read_text())
                    page.locator(f'.recording-card[data-key="{key}"]').click()
                    page.wait_for_function("(key) => location.hash === '#' + key", arg=key)
                    page.wait_for_function("(title) => document.querySelector('#recording-title').textContent === title", arg=entry["title"])
                    check(page.locator("#source-link").get_attribute("href") == data["source"]["source_url"], f"{width}/{key}: exact source URL")
                    check(page.locator("#download-link").get_attribute("href") == entry["data"], f"{width}/{key}: exact downloadable data")
                    check(page.locator("#reference-count").inner_text() == f'{entry["reference_events"]:,} events', f"{width}/{key}: reference count")
                    for target in (100.25, entry["duration"] - 15):
                        page.locator("#jump-time").fill(str(target))
                        page.locator("#jump-time").press("Enter")
                        for kind in ("reference", "prediction"):
                            expected = [str(i) for i, e in enumerate(data[kind]["events"]) if e["start"] <= target < e["end"]]
                            actual = page.locator(f"#{kind}-events .is-active").evaluate_all("nodes => nodes.map(n => n.dataset.index)")
                            check(set(actual) == set(expected), f"{width}/{key}/{target}: {kind} active set exact", {"expected": expected, "actual": actual})
                    page.locator("#view-mode").select_option("all")
                    for kind in ("reference", "prediction"):
                        check(page.locator(f"#{kind}-events .event").count() == 50, f"{width}/{key}: {kind} pagination")
                    page.locator("#reference-pagination button").last.click()
                    check(page.locator("#reference-pagination span").inner_text().startswith("2 /"), f"{width}/{key}: next page")
                    page.locator("#reference-events details").first.locator("summary").click()
                    page.locator("#reference-events details").first.locator("dl dt").first.wait_for(state="visible")
                    check(page.locator("#reference-events details").first.locator("dl dt").count() > 0, f"{width}/{key}: full attributes open")
                    page.locator("#view-mode").select_option("follow")
                    check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), f"{width}/{key}: no horizontal overflow")
                    if key == "01_movie_en":
                        page.screenshot(path=str(output / f"demo-{width}.png"), full_page=True)
                    if width == 1440 and args.media_root:
                        media = args.media_root / (key + ".wav")
                        page.locator("#local-file").set_input_files(str(media))
                        page.wait_for_function("() => document.querySelector('audio').readyState >= 1", timeout=30000)
                        check(page.locator("#media").get_attribute("src").startswith("blob:" + base), f"{key}: local blob playback only")
                        target = entry["duration"] - 20
                        page.locator("#jump-time").fill(str(target))
                        page.locator("#jump-time").press("Enter")
                        page.wait_for_function("(t) => Math.abs(document.querySelector('audio').currentTime - t) < .1 && !document.querySelector('audio').seeking", arg=target, timeout=30000)
                        page.locator("#media").evaluate("a => {a.muted = true; return a.play()}")
                        page.wait_for_timeout(400)
                        page.locator("#media").evaluate("a => a.pause()")
                        actual_time = page.locator("#media").evaluate("a => a.currentTime")
                        check(actual_time >= target, f"{key}: late seek and playback", actual_time)
                        for kind in ("reference", "prediction"):
                            expected = {str(i) for i, e in enumerate(data[kind]["events"]) if e["start"] <= actual_time < e["end"]}
                            actual = set(page.locator(f"#{kind}-events .is-active").evaluate_all("nodes => nodes.map(n => n.dataset.index)"))
                            check(actual == expected, f"{key}: {kind} synchronized to actual playback")
                context.close()
            check(not errors, "No JavaScript or unexpected-network errors", errors)
            browser.close()
            completed = True
    finally:
        server.shutdown()
        server.server_close()
        receipt = {"checked_utc": datetime.now(timezone.utc).isoformat(), "site": str(site), "checks": checks,
                   "passed": completed and bool(checks) and all(c["passed"] for c in checks) and not errors,
                   "errors": errors, "requests": requests, "original_local_media_tested": bool(args.media_root)}
        (output / "browser_validation.json").write_text(json.dumps(receipt, indent=2) + "\n")
    print(json.dumps({"passed": receipt["passed"], "checks": len(checks), "errors": errors}, indent=2))


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--site", type=Path, default=Path(__file__).resolve().parent)
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--media-root", type=Path)
    run(p.parse_args())
