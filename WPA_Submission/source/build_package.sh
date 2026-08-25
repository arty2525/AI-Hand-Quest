#!/usr/bin/env bash
set -euo pipefail
ROOT='WPA_Submission'
mkdir -p "$ROOT/docs" "$ROOT/pdfs" "$ROOT/media" "$ROOT/slides"

python - <<'PY'
import qrcode
from pathlib import Path
out=Path('WPA_Submission/media'); out.mkdir(parents=True,exist_ok=True)
for name,url in [
 ('QR_Student_Game.png','https://arty2525.github.io/AI-Hand-Quest/'),
 ('QR_Teacher_Summary.png','https://arty2525.github.io/AI-Hand-Quest/teacher-summary.html'),
 ('QR_Mentimeter_Join.png','https://www.menti.com/alxdzgt83ktx')
]:
    qr=qrcode.QRCode(version=None,box_size=8,border=4)
    qr.add_data(url); qr.make(fit=True)
    qr.make_image(fill_color='black',back_color='white').save(out/name)
PY

# Generate the GitHub-packaged teaching slide deck from the latest aligned source.
rm -f "$ROOT/slides"/*.pptx
pandoc "$ROOT/source/slide_deck_mentimeter.md" \
  --from=gfm --to=pptx --slide-level=1 \
  -o "$ROOT/slides/AI_to_ESP32_Unit3_Teaching_Slides_Mentimeter.pptx"

# Rebuild editable Word documents from numbered Markdown sources.
rm -f "$ROOT/docs"/*.docx
for md in "$ROOT"/source/[0-9][0-9]_*.md; do
  base="$(basename "$md" .md)"
  pandoc "$md" --from=gfm --to=docx --metadata lang=th-TH \
    --resource-path="$ROOT:$ROOT/media:$ROOT/source" \
    -o "$ROOT/docs/$base.docx"
done

python "$ROOT/source/build_scorebook.py"

# Convert Word documents to PDF.
rm -f "$ROOT/pdfs"/*.pdf
mkdir -p /tmp/lo-profile
for doc in "$ROOT"/docs/*.docx; do
  libreoffice -env:UserInstallation=file:///tmp/lo-profile --headless \
    --convert-to pdf --outdir "$ROOT/pdfs" "$doc" >/tmp/lo.log 2>&1 || { cat /tmp/lo.log; exit 1; }
done

mapfile -t parts < <(find "$ROOT/pdfs" -maxdepth 1 -type f -name '[0-9][0-9]_*.pdf' | sort)
if ((${#parts[@]})); then
  pdfunite "${parts[@]}" "$ROOT/pdfs/AI_to_ESP32_WPA_ชุดเอกสารรวม.pdf"
fi

rm -f "$ROOT/AI_to_ESP32_WPA_ReadyToSubmit.zip"
(
  cd "$ROOT"
  zip -qr AI_to_ESP32_WPA_ReadyToSubmit.zip \
    docs pdfs slides media README.txt README.md REFERENCES.txt CHECKLIST_ก่อนส่งงาน.txt
)
