# LongCap listening demo

[Paper (arXiv)](https://arxiv.org/abs/2611.11125) · [Project page](https://jctian98.github.io/longcap/) · [Quickstart](https://github.com/jctian98/longcap-code/blob/main/docs/quickstart.md) · [Code](https://github.com/jctian98/longcap-code) · [Model, FP8](https://huggingface.co/JinchuanTian/LongCap-35B-A3B-FP8) · [Model, BF16](https://huggingface.co/JinchuanTian/LongCap-35B-A3B) · [Dataset](https://huggingface.co/datasets/JinchuanTian/LongCapBench-TAC-Long)

An interactive companion to *LongCap: Hour-Scale Timestamped Audio Captioning via Chunk-wise Processing*. Listen to four complete recordings and ten short clips, with synchronized Reference / LongCap 35B / LongCap 122B panels, waveform seeking, active events, linked context, search, and event-type filters.

Audio plays directly from this site. Each example includes MP3 and WebM sources; the player falls back automatically when necessary. No local file, model API, or inference server is needed.

The homepage and example footers link to the arXiv paper, code, Quickstart, FP8/BF16 models, and LongCapBench-TAC-Long dataset. Destinations are configured in `links.json`.

## Preview and verification

From this repository:

```bash
python scripts/serve_demo.py --port 8081
```

Open <http://127.0.0.1:8081/longcap/>. The loopback preview supports byte ranges for audio seeking and uses the same project prefix as GitHub Pages.

```bash
python scripts/verify_demo.py
# Optional full browser check; requires Playwright and its Chromium browser:
python scripts/verify_demo.py --browser --output /tmp/longcap-demo-check
# Repeat against the published site:
python scripts/verify_demo.py --browser --base https://jctian98.github.io/longcap/ --output /tmp/longcap-demo-live-check
```

The static check verifies the original audio/data hashes and all example routes. The browser check exercises all 14 examples, playback and late seeking, current/linked event synchronization, audio format fallback, resource links, and mobile layout. Save test reports outside this repository.

## Saved examples

The audio, waveform data, reference events, and both model outputs are restored unchanged from the October 4 paper demo (`af392c0`). Their SHA-256 hashes are recorded in `scripts/demo-asset-manifest.json`. The four long recordings retain all 6,520 reference events. Ten additional clips are each shorter than one minute.

The saved 35B/122B examples retain their original display translations and demo curation; they are separate from the newer released FP8/BF16 model downloads. Reference captions are human annotations; reference dependency links are text-derived candidates, as labeled in the interface. Author affiliations match the current release page.

## Deployment

The site is static and has no build step. GitHub Pages serves `main` from the repository root at <https://jctian98.github.io/longcap/>. The original example paths remain available under `examples/`.

This repository contains the webpage. Inference code lives in [longcap-code](https://github.com/jctian98/longcap-code). The anonymous Cloudflare demo is deployed separately.

## License

The website and its scripts are released under [Apache-2.0](LICENSE). Original audio retains its source terms; this license does not relicense the recordings.
