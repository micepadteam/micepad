# Micepad Static Site

## Validation Workflow

When making CSS/HTML changes to this static site, always validate visually using HEADLESS Chrome (never hijack user's screen):

1. Make the change to the file in `dist/`
2. Take headless screenshot to verify
3. Repeat until the fix is confirmed

### Headless Screenshot Command:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --disable-gpu --screenshot=/tmp/pricing_headless.png --window-size=1400,1200 http://localhost:5500/pricing.html 2>/dev/null
```

Then read `/tmp/pricing_headless.png` to verify the change.

Adjust URL and window-size as needed for the page being tested.

## Local Development

Start Python HTTP server from the `dist` folder:
```bash
cd /Users/nguyenvu/projects/micepad-static/dist && python3 -m http.server 5500
```

Access at: http://localhost:5500
