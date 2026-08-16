# Shashwat Gupta — Portfolio Site

A static website. No build tools, no framework, no npm install needed.

## Folder structure

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    ├── images/     ← photos + posters/thumbnails go here
    └── videos/     ← your video files go here
```

## Where to put your videos

1. **Drop video files into `assets/videos/`**
   Use short, clean, no-space filenames, e.g.:
   ```
   assets/videos/golden-hour-getaway.mp4
   assets/videos/behind-the-sizzle.mp4
   ```
   MP4 (H.264) is the safest format for browser playback. Keep individual files
   reasonably small (compress to ~1080p / a few hundred MB max) — this is a
   website, not a raw export, and large files will make the page slow to load.

2. **(Optional but recommended) Add a poster/thumbnail image**
   A single frame grab, saved as a `.jpg`, placed in `assets/images/`, e.g.:
   ```
   assets/images/edit-01-poster.jpg
   ```
   This is what shows in the grid card before someone presses play — without
   it, the card just shows a plain color background.

3. **Open `js/main.js`** and find the `editingProjects` and `videographyProjects`
   arrays near the top of the file (search for "TO ADD YOUR VIDEOS" — there's
   a comment block right above them with the same instructions). Each project
   is one object like this:

   ```js
   { tag:'Brand Film', title:'Golden Hour Getaway', desc:'...',
     video:'', poster:'' }
   ```

   Fill in the `video` and `poster` fields with the paths from steps 1–2:

   ```js
   { tag:'Brand Film', title:'Golden Hour Getaway', desc:'...',
     video:'assets/videos/golden-hour-getaway.mp4',
     poster:'assets/images/edit-01-poster.jpg' }
   ```

4. **Save the file and refresh the page.** That project's card now shows the
   poster image, and clicking it plays the real video with standard
   play/pause/fullscreen controls. Any project left with `video:''` keeps
   showing the "Video preview coming soon" placeholder automatically — so you
   can fill these in one at a time, in any order, without breaking anything.

The same pattern works for both `editingProjects` (Video Editing Reel section)
and `videographyProjects` (Videography Reel section) — they're two separate
arrays but work identically.

## How to run this in VS Code

You don't need Node, npm, or any build step — it's plain HTML/CSS/JS.

1. **Unzip** the project folder anywhere on your computer.
2. **Open VS Code** → `File > Open Folder…` → select the unzipped `portfolio`
   folder (the one containing `index.html`).
3. **Install the "Live Server" extension** (by Ritwick Dey) from the
   Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X` on Mac, search "Live
   Server").
4. **Right-click `index.html`** in the file explorer → **"Open with Live
   Server"**. This opens the site in your browser at something like
   `http://127.0.0.1:5500` and auto-refreshes whenever you save a file —
   handy while you're adding videos or tweaking copy.

   Alternative without the extension: open a terminal in VS Code
   (`` Ctrl+` ``) and run:
   ```
   python3 -m http.server 8080
   ```
   then open `http://localhost:8080` in your browser. (Opening `index.html`
   directly by double-clicking it also mostly works, but a local server is
   more reliable — some browsers block video/image loading from `file://`
   paths.)

## Deploying it live

When you're happy with it, the whole `portfolio` folder can be dragged
straight into Netlify Drop (netlify.com/drop) or connected as a GitHub repo to
Vercel/Netlify/GitHub Pages — no configuration needed since there's no build
step.
