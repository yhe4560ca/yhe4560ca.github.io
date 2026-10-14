# YHECA

Static, browser-only website for the warehouse, hosted via GitHub Pages. No build step, no backend — open the HTML files directly or via the links below.

**Public URL:** https://yhe4560ca.github.io/

## Local preview

Check changes locally before pushing — anything pushed to `main` goes live.

```sh
python3 -m http.server 5500 --bind 127.0.0.1
```

Then open http://localhost:5500/ in a browser. Stop the server with Ctrl+C.

## Label Creator

- [Badge Barcode Label Creator](https://yhe4560ca.github.io/tools/badge-barcode-label.html) — printable 6x4 labels with the leading letters in a black badge (bin locations).
- [Pallet Info Label Creator](https://yhe4560ca.github.io/tools/pallet-info-generator.html) — printable portrait 4x6 pallet labels.
- [WO Bin Label Creator](https://yhe4560ca.github.io/tools/wo-badge-barcode-label.html) — printable 4x6 barcode labels for work-order bins.
- [Defective Bin Label Creator](https://yhe4560ca.github.io/tools/defective-badge-barcode-label.html) — four location barcode labels per 4x6 sheet.

## Documentation

Documentation pages (SOPs, location maps, contacts, how-tos) live in `docs/`. To add one, copy `docs/_template.html`, fill it in, and add an entry for it in `docs/index.html`. Pages in `docs/` are highlighted under Documentation in the navigator automatically; label creators in `tools/` are highlighted under Label Creator.

The site is public — don't put passwords, personal phone numbers, or other sensitive info on it.
