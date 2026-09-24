import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


class ProjectNotebookBuildTests(unittest.TestCase):
    def test_every_notebook_is_converted_from_the_workspace_root(self):
        template = Path(__file__).resolve().parents[1] / "_projects/_template/Makefile"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            project = root / "_projects/lessons/example"
            (project / "notebooks").mkdir(parents=True)
            (root / "Makefile").touch()
            shutil.copyfile(template, project / "Makefile")
            for name in ("first.ipynb", "second.ipynb"):
                (project / "notebooks" / name).write_text("{}")
            (root / "venv/bin").mkdir(parents=True)
            (root / "venv/bin/python3").symlink_to(sys.executable)
            (root / "scripts").mkdir()
            (root / "scripts/convert_notebooks.py").write_text(
                "import json, pathlib, sys\n"
                "source = pathlib.Path(sys.argv[1])\n"
                "assert source.is_file(), source\n"
                "with open('conversions.jsonl', 'a') as output:\n"
                "    output.write(json.dumps(source.name) + '\\n')\n"
            )

            result = subprocess.run(
                ["make", "-C", str(project), "convert"],
                capture_output=True, text=True,
            )

            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            converted = [json.loads(line) for line in (root / "conversions.jsonl").read_text().splitlines()]
            self.assertEqual(converted, ["first.ipynb", "second.ipynb"])


if __name__ == "__main__":
    unittest.main()
