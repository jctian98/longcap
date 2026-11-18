#!/usr/bin/env python3
"""Quiet loopback-only preview of the GitHub Pages /longcap/ project path."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def guess_type(self, path):
        if str(path).endswith('.mp3'):
            return 'audio/mpeg'
        if str(path).endswith('.webm'):
            return 'audio/webm'
        return super().guess_type(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def send_head(self):
        requested = unquote(urlsplit(self.path).path)
        if requested in ('/', '/longcap'):
            self.send_response(302)
            self.send_header('Location', '/longcap/')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        root = Path(self.directory).resolve()
        relative = requested[len('/longcap/'):] if requested.startswith('/longcap/') else None
        path = (root / relative).resolve() if relative is not None else root / '404.html'
        if path.is_dir():
            path = path / 'index.html'
        missing = relative is None or root not in path.parents or not path.is_file()
        if missing:
            path = root / '404.html'
        size = path.stat().st_size
        start, end = 0, size - 1
        range_header = self.headers.get('Range')
        status = 404 if missing else 200
        if range_header and not missing:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', range_header)
            if not match or not any(match.groups()):
                self.send_error(416)
                return None
            start = int(match[1]) if match[1] else max(0, size - int(match[2]))
            end = min(int(match[2]) if match[1] and match[2] else size - 1, size - 1)
            if start > end or start >= size:
                self.send_error(416)
                return None
            status = 206
        self.send_response(status)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Content-Length', str(max(0, end - start + 1)))
        self.send_header('Accept-Ranges', 'bytes')
        if status == 206:
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        source = path.open('rb')
        source.seek(start)
        self._remaining = max(0, end - start + 1)
        return source

    def copyfile(self, source, output):
        remaining = self._remaining
        try:
            while remaining:
                block = source.read(min(1 << 16, remaining))
                if not block:
                    break
                output.write(block)
                remaining -= len(block)
        except (BrokenPipeError, ConnectionResetError):
            pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--public', type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument('--port', type=int, default=8081)
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(args.public))) as server:
        print(f'LongCap public preview: http://127.0.0.1:{server.server_port}/longcap/', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    main()
