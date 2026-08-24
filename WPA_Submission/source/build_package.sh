#!/usr/bin/env bash
set -euo pipefail
ROOT='WPA_Submission'
mkdir -p "$ROOT/docs" "$ROOT/pdfs" "$ROOT/media"

# Generate QR codes used by the submission package.
python - <<'PY'
import qrcode
from pathlib import Path
out=Path('WPA_Submission/media'); out.mkdir(parents=True,exist_ok=True)
for name,url in [
 ('QR_Student_Game.png','https://arty2525.github.io/AI-Hand-Quest/'),
 ('QR_Teacher_Summary.png','https://arty2525.github.io/AI-Hand-Quest/teacher-summary.html')]:
    qr=qrcode.QRCode(version=None,box_size=8,border=4); qr.add_data(url); qr.make(fit=True); qr.make_image(fill_color='black',back_color='white').save(out/name)
PY

# Build editable Word documents from the Markdown source files.
for md in "$ROOT"/source/[0-9][0-9]_*.md; do
  base="$(basename "$md" .md)"
  pandoc "$md" --from=gfm --to=docx --metadata lang=th-TH --resource-path="$ROOT:$ROOT/media:$ROOT/source" -o "$ROOT/docs/$base.docx"
done

# Build scorebook workbook.
python "$ROOT/source/build_scorebook.py"

# Convert Word documents to PDF.
rm -f "$ROOT/pdfs"/*.pdf
mkdir -p /tmp/lo-profile
for doc in "$ROOT"/docs/*.docx; do
  libreoffice -env:UserInstallation=file:///tmp/lo-profile --headless --convert-to pdf --outdir "$ROOT/pdfs" "$doc" >/tmp/lo.log 2>&1 || { cat /tmp/lo.log; exit 1; }
done

# Merge the individual PDFs into one submission PDF.
mapfile -t parts < <(find "$ROOT/pdfs" -maxdepth 1 -type f -name '[0-9][0-9]_*.pdf' | sort)
if ((${#parts[@]})); then
  pdfunite "${parts[@]}" "$ROOT/pdfs/AI_to_ESP32_WPA_ชุดเอกสารรวม.pdf"
fi

# Build downloadable ZIP bundle.
rm -f "$ROOT/AI_to_ESP32_WPA_ReadyToSubmit.zip"
(
  cd "$ROOT"
  zip -qr AI_to_ESP32_WPA_ReadyToSubmit.zip docs pdfs media README.txt REFERENCES.txt CHECKLIST_ก่อนส่งงาน.txt
)
