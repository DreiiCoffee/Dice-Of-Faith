# Dice of Fate — @Dreiicoffee

Windows desktop app with a modern 3D dice GUI (embedded window). Roll three dice, get a random fate. Rolling 666 triggers a brief warning overlay and eerie sound.

## Run
1) Double‑click `run.bat`
2) Or in Terminal (PowerShell):
   - `cd C:\Users\User\Downloads\project1`
   - `python main.py`

Notes:
- On first run, `pywebview` will auto‑install.
- If the window fails to open, install the “Microsoft Edge WebView2 Runtime,” then run again.

## Use
- Click Roll or press Space
- 1‑second lockout prevents accidental double‑clicks
- 666 shows a 5‑second “YOU ARE BEING WATCHED” overlay with sound

## Customize
- Edit fates in `web/app.js` (the `FATE_MESSAGES` arrays). Add/remove lines as you like.
- Change spacing/sizes in `web/style.css`.

## Troubleshooting
- “pywebview not found”: run `python -m pip install pywebview`
- Blank window: install WebView2 Runtime and retry
- No sound: your OS/browser may block autoplay until first user interaction; click once and try again
"# test" 
