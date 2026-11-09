#!/usr/bin/env python3
"""Check static data parity and the site's explicit no-media file allowlist."""
import argparse
import hashlib
import json
from pathlib import Path


def validate(site, benchmark):
    catalog = json.loads((site / "catalog.json").read_text())
    refs = {r["key"]: r for r in (json.loads(s) for s in (benchmark / "references.jsonl").read_text().splitlines())}
    preds = {r["key"]: r for r in (json.loads(s) for s in (benchmark / "predictions/longcap-35b-a3b-fp8.jsonl").read_text().splitlines())}
    allowed = {"index.html", "styles.css", "app.js", "favicon.svg", "links.json", "catalog.json", "README.md", "LICENSE", "build.py", "validate.py", "test_browser.py", ".nojekyll", "robots.txt", "404.html"}
    allowed |= {r["data"] for r in catalog["examples"]}
    actual = {str(p.relative_to(site)) for p in site.rglob("*") if p.is_file()}
    assert actual == allowed, {"missing": sorted(allowed-actual), "unexpected": sorted(actual-allowed)}
    assert not any(p.is_symlink() for p in site.rglob("*"))
    assert len(catalog["examples"]) == 4
    for entry in catalog["examples"]:
        path = site / entry["data"]
        assert hashlib.sha256(path.read_bytes()).hexdigest() == entry["sha256"]
        data = json.loads(path.read_text())
        assert data["reference"] == refs[entry["key"]]
        assert data["prediction"] == preds[entry["key"]]
        assert data["source"]["media_included"] is False
    assert "Independent Researcher" in (site / "index.html").read_text()
    assert "media-src blob:" in (site / "index.html").read_text()
    return {"valid": True, "examples": 4, "event_data_matches_benchmark": True, "media_files": 0, "files": len(actual)}


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--site", type=Path, default=Path(__file__).resolve().parent)
    p.add_argument("--benchmark", type=Path, default=Path(__file__).resolve().parent.parent / "benchmark")
    args = p.parse_args()
    print(json.dumps(validate(args.site, args.benchmark), indent=2))
