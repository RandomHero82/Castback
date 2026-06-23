# CastBack

CastBack is a focused people search for film and television. Search an actor or crew member and quickly see the work you are most likely to recognize them from.

## Prerequisites

- Node.js 20 or newer
- A free [TMDb account](https://www.themoviedb.org/signup)

## Get a TMDb token

1. Sign in to TMDb and open **Settings → API** at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
2. Request an API key (the personal/developer option is sufficient).
3. Copy either the **API Read Access Token** or the shorter **API Key**.
4. In CastBack, open **Settings**, paste the credential, and select **Save credential**.

The credential is never hardcoded or sent anywhere except `api.themoviedb.org`. It is stored in your browser's localStorage. Searches, person data, credits, external IDs, and image configuration are cached locally with an expiration time.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

For a production build:

```bash
npm run build
npm run preview
```

## API endpoints

CastBack uses `/search/person`, `/person/{id}`, `/person/{id}/combined_credits`, `/person/{id}/external_ids`, and `/configuration` from the TMDb v3 API.

This product uses the TMDb API but is not endorsed or certified by TMDb.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for “Deploy CastBack to GitHub Pages” to finish.
5. Visit `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` on your phone.

To install it, open that address in Chrome and choose **Add to Home screen**, or in iPhone Safari choose **Share → Add to Home Screen**.
