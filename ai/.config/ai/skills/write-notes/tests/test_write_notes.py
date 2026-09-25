import os
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "write-notes.py"


class WriteNotesTests(unittest.TestCase):
    def run_note(self, home, *args):
        content = Path(home) / "input.md"
        content.write_text("# Findings\nUseful context.", encoding="utf-8")
        return subprocess.run(
            [sys.executable, str(SCRIPT), "storage-migration", "--title",
             "Storage Migration", "--content", str(content), *args],
            check=True,
            capture_output=True,
            text=True,
            env={**os.environ, "HOME": str(home)},
        )

    def test_default_path_uses_research_notes_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            result = self.run_note(home)
            expected = home / "Documents" / "research" / "notes" / (
                f"{datetime.now():%Y%m%d}_storage-migration.md"
            )
            self.assertEqual(Path(result.stdout.strip()), expected)
            self.assertIn("Useful context.", expected.read_text(encoding="utf-8"))

    def test_explicit_target_overrides_default_path(self):
        with tempfile.TemporaryDirectory() as directory:
            home = Path(directory)
            target = home / "Documents" / "research" / "session" / "notes.md"
            result = self.run_note(home, "--target", str(target))
            self.assertEqual(Path(result.stdout.strip()), target)
            self.assertTrue(target.is_file())
            self.assertFalse((home / "Documents" / "research" / "notes").exists())


if __name__ == "__main__":
    unittest.main()
