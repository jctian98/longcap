# LongCap demo

[Project page](https://jctian98.github.io/longcap/) · [Quickstart](https://github.com/jctian98/longcap-code/blob/main/docs/quickstart.md) · [Code](https://github.com/jctian98/longcap-code) · [Model, FP8](https://huggingface.co/JinchuanTian/LongCap-35B-A3B-FP8) · [Model, BF16](https://huggingface.co/JinchuanTian/LongCap-35B-A3B) · [Benchmark](https://huggingface.co/datasets/JinchuanTian/LongCapBench-TAC-Long)

An interactive companion to *LongCap: Hour-Scale Timestamped Audio Captioning via Chunk-wise Processing*. Explore timestamped speech, music, and sound-event captions across four full-length recordings, with human references and LongCap-35B-A3B-FP8 predictions side by side.

The shared timeline and event lists work without media. For synchronized playback, follow a recording's original source link and select a local media file. Playback stays in your browser; the website does not upload the file or redistribute audio/video.

## Preview locally

This directory is a complete static website. From here:

```bash
python -m http.server 8081 --bind 127.0.0.1
```

Open `http://127.0.0.1:8081/`. Use **All events** to browse every saved event, or **Events around the playhead** to follow playback. Event-time buttons seek within a selected local file. The attribute panels preserve the original annotation fields and values.

## Data

The page contains all 6,520 human reference events and 6,505 saved LongCap-35B-A3B-FP8 caption events from LongCapBench-TAC-Long. Each recording displays its saved completion status; three model outputs are partial. Labels and predictions retain their original content.

The optional media-duration check helps detect a different recording, but does not establish exact audio identity. The [benchmark](https://huggingface.co/datasets/JinchuanTian/LongCapBench-TAC-Long) supplies evaluated WAV checksums and `verify_audio.py` for that purpose.

The built site consists of HTML, CSS, JavaScript, SVG, and JSON. To regenerate the data from a downloaded copy of the benchmark dataset, use:

```bash
python build.py --benchmark /path/to/extracted/benchmark
```

Navigation destinations are configured in `links.json`. The data build does not download media.

## License

The website, its scripts, and the annotations are released under [Apache-2.0](LICENSE). Source media keeps its original terms.
