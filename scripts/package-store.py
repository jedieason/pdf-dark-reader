"""Package the committed extension and generated store icons without rebuilding PDF.js."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parent.parent
out = root / 'chrome-store-submission'
manifest = json.loads((root / 'extension/manifest.json').read_text())
manifest['icons']['32'] = 'icon32.png'
manifest['action']['default_icon']['32'] = 'icon32.png'
archive = out / f"pdf-dark-reader-{manifest['version']}.zip"
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for path in sorted((root / 'extension').rglob('*')):
        if not path.is_file() or any(p.startswith('.') for p in path.relative_to(root / 'extension').parts):
            continue
        rel = path.relative_to(root / 'extension').as_posix()
        if rel == 'manifest.json':
            continue
        z.write(path, rel)
    z.writestr('manifest.json', json.dumps(manifest, indent=2)+'\n')
    z.write(root / 'NOTICE.md', 'NOTICE.md')
    z.write(root / 'LICENSE', 'PDF-Dark-Reader-LICENSE')
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert 'manifest.json' in z.namelist()
    assert len(manifest['description']) <= 132
    for name in [manifest['background']['service_worker'], manifest['action']['default_popup'], *manifest['icons'].values()]:
        assert name in z.namelist(), name
    for path in (root / 'extension').rglob('*'):
        if path.is_file() and path.suffix in ('.js', '.mjs', '.wasm'):
            assert z.read(path.relative_to(root / 'extension').as_posix()) == path.read_bytes()
(out / 'SHA256SUMS.txt').write_text(hashlib.sha256(archive.read_bytes()).hexdigest()+'  '+archive.name+'\n')
print(f'{archive.name}: {archive.stat().st_size:,} bytes; ZIP integrity and runtime equality passed.')
