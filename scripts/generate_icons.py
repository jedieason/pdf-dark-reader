"""Compatibility entry point for the shared production-logo resizer."""
from pathlib import Path
import subprocess
subprocess.run(['node', str(Path(__file__).with_name('generate-icons.mjs'))], check=True)
