# THE HUNT — GitHub Pages starter project

This is a single-page puzzle-hunt website starter. It includes a home screen, an opening stage, a 15-question music challenge, a next-stage placeholder, and a basic host configuration editor.

## 1. Put the project on GitHub

1. Sign in to GitHub and choose **New repository**.
2. Give it a name such as `the-hunt`.
3. Choose **Public** (GitHub Pages is available for public repositories on the free plan) and create the repository.
4. On the new repository page, choose **Add file → Upload files**.
5. Upload the contents of this folder — `index.html`, `css`, `js`, `data`, and `assets`. Upload the folders themselves, not just the files inside them.
6. Commit the upload.

## 2. Turn on GitHub Pages

1. Open the repository's **Settings**.
2. Choose **Pages** in the left-hand menu.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then save.
5. Wait a minute or two. GitHub will show your website address on the Pages settings screen.

## 3. Add your music clips

Put your own audio files in `assets/audio/`. Use these exact filenames for the matching question:

- `question-1-10s.mp3`, `question-1-15s.mp3`, `question-1-20s.mp3`
- `question-2-10s.mp3`, `question-2-15s.mp3`, `question-2-20s.mp3`
- Continue the same pattern through question 15.

The clip files should be prepared to the intended lengths (10, 15, and 20 seconds). The site also stops playback at those limits. Keep filenames simple and match the names exactly.

## 4. Add your questions and answers

Edit `data/questions.json`. Each question has:
- `question`: the question text
- `options`: exactly four answer choices
- `answerIndex`: the correct option's zero-based position (`0` = A, `1` = B, `2` = C, `3` = D)
- `clips`: paths to the 10-, 15-, and 20-second audio files

You can also open your published site with `#host` at the end of the address to use the basic JSON editor. Export the edited file and replace `data/questions.json` in GitHub with it.

## 5. Add your own stages

The first and next stages currently contain placeholder text. Edit the text in `data/questions.json` for the intro and next stage. To add more interactive stages, the website's `index.html` and `js/app.js` will need extending.

## Important limitations

- GitHub Pages is static hosting. The answer key is sent to the browser, so a determined player can inspect the page files and find it. This starter is suitable for a friendly/private hunt, not a high-security contest.
- The host editor is not password-protected and is not a secure admin system. Do not put sensitive information in the configuration.
- Progress is not stored on a server or shared between devices. The challenge starts fresh when the page is reloaded.
- Changes made in the host editor are not automatically published. Export `questions.json`, then upload/replace that file in your GitHub repository and commit the change.
- Audio files are not included. Add audio that you are allowed to use.

## Local preview

Because the site loads a JSON file, don't just double-click `index.html`. You can preview it with a local web server, or publish it to GitHub Pages and open the Pages link.
