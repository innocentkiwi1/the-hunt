# THE HUNT

A static GitHub Pages hunt website with a music quiz and a host editor.

## Quick start
- Open `index.html` to view the player.
- Open `admin.html` to edit the hunt.
- In Host Setup, edit each question, four answer choices, select the correct answer, and choose the three audio clips.
- Click **Download updated website**.
- Extract the ZIP and upload its contents to the root of your GitHub repository.

## Audio naming
The host editor saves the three selected clips for each question at:
- `assets/audio/question-N-10s.mp3`
- `assets/audio/question-N-15s.mp3`
- `assets/audio/question-N-20s.mp3`

The filename is assigned automatically; you do not need to rename your audio files first.

## GitHub Pages
In the repository, open Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

## Important limitations
GitHub Pages is static hosting. The host editor cannot write directly to GitHub. After making edits, download the updated website ZIP and upload its contents to GitHub to publish them. The answer key is part of the public website files and is not secure against someone inspecting the source. The host page is not password protected. This is suitable for a casual hunt, not for confidential answers.
