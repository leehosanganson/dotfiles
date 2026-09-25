import os
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "write-report.py"


class ReportHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.tags = []

    def handle_starttag(self, tag, attrs):
        self.tags.append(tag)
        if tag == "a":
            self.links.append(dict(attrs))


class WriteReportTests(unittest.TestCase):
    def run_report(self, content, *args, home):
        content_path = Path(home) / "input.md"
        content_path.write_text(content, encoding="utf-8")
        env = os.environ.copy()
        env["HOME"] = str(home)
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--title", "A <Report> Title",
             "--content", str(content_path), *args],
            check=True,
            capture_output=True,
            text=True,
            env=env,
        )

    def test_default_output_uses_reports_directory_and_title_slug(self):
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            result = self.run_report("# Findings", home=home)
            expected = home / "Documents" / "research" / "reports" / (
                f"{datetime.now():%Y%m%d}_a-report-title.html"
            )
            self.assertEqual(Path(result.stdout.strip()), expected)
            self.assertTrue(expected.is_file())

    def test_project_or_slug_can_set_default_name(self):
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            result = self.run_report("Body", "--project", "Project Delta", home=home)
            self.assertTrue(result.stdout.strip().endswith("_project-delta.html"))

        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            result = self.run_report("Body", "--slug", "Custom Report", home=home)
            self.assertTrue(result.stdout.strip().endswith("_custom-report.html"))

    def test_explicit_target_creates_directories_and_safe_rendering(self):
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            target = home / "Documents" / "research" / "session" / "report.html"
            markdown = (
                '<script>alert("x")</script>\n\n'
                '[Source](https://example.com/?a=1&b=2) '
                '[Unsafe](javascript:alert(1))\n\n'
                '`<code>` and **bold**'
            )
            result = self.run_report(
                markdown, "--target", str(target), home=home
            )
            self.assertEqual(Path(result.stdout.strip()), target)
            self.assertTrue(target.is_file())

            html = target.read_text(encoding="utf-8")
            parser = ReportHTMLParser()
            parser.feed(html)
            parser.close()
            self.assertIn("html", parser.tags)
            self.assertEqual(len(parser.links), 1)
            self.assertEqual(parser.links[0]["href"], "https://example.com/?a=1&b=2")
            self.assertIn("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;", html)
            self.assertIn("[Unsafe](javascript:alert(1))", html)
            self.assertIn("&lt;code&gt;", html)
            self.assertIn("<strong>bold</strong>", html)

    def test_relative_target_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            content_path = home / "input.md"
            content_path.write_text("Body", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(SCRIPT), "--title", "Report", "--content",
                 str(content_path), "--target", "relative/report.html"],
                capture_output=True,
                text=True,
                env={**os.environ, "HOME": str(home)},
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("must be an absolute path", result.stderr)


if __name__ == "__main__":
    unittest.main()
