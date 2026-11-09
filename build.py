#!/usr/bin/env python3
"""Rebuild static example JSON directly from the packaged benchmark."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path


def rows(path):
    return {r["key"]: r for r in (json.loads(s) for s in path.read_text().splitlines() if s.strip())}


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n")


def build(benchmark, output):
    sys.dont_write_bytecode = True  # Keep the benchmark directory unchanged.
    spec = importlib.util.spec_from_file_location("benchmark_validator", benchmark / "validate.py")
    validator = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(validator)
    validator.validate(benchmark)
    refs = rows(benchmark / "references.jsonl")
    preds = rows(benchmark / "predictions/longcap-35b-a3b-fp8.jsonl")
    sources = rows(benchmark / "sources.jsonl")
    statuses = {r["key"]: r for r in json.loads((benchmark / "prediction_status.json").read_text())["recordings"]}
    notes = {r["key"]: r for r in json.loads((benchmark / "annotation_notes.json").read_text())["recordings"]}
    examples = []
    for key, ref in refs.items():
        source = sources[key]
        payload = {"key": key, "source": source, "reference": ref, "prediction": preds[key],
                   "prediction_status": statuses[key], "annotation_notes": notes[key],
                   "model": "LongCap-35B-A3B-FP8"}
        path = output / "data" / (key + ".json")
        write(path, payload)
        examples.append({"key": key, "title": source["title"], "language": source["language"],
                         "duration": ref["duration"], "reference_events": len(ref["events"]),
                         "prediction_events": len(preds[key]["events"]), "status": statuses[key]["status"],
                         "data": "data/" + key + ".json", "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    write(output / "catalog.json", {"dataset": "LongCapBench-TAC-Long v0.8", "examples": examples,
                                     "reference_events": 6520, "prediction_events": 6505,
                                     "media_included": False})
    print(json.dumps({"examples": len(examples), "reference_events": 6520, "prediction_events": 6505,
                      "media_included": False}, indent=2))


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    here = Path(__file__).resolve().parent
    p.add_argument("--benchmark", type=Path, default=here.parent / "benchmark")
    p.add_argument("--output", type=Path, default=here)
    args = p.parse_args()
    build(args.benchmark, args.output)
