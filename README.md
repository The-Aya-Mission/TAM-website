# The Aya Mission — Website

A custom static website (plain HTML/CSS, no builder required). Design based on the TAM pitch deck: forest green textured canvas, torn-paper panels, gold tape accents, and the Aya Mission logo.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, outcomes, pathways, mission, testimonials, donate CTA |
| `team.html` | Meet the Team (7 leadership bios) |
| `impact.html` | Impact & Research — stats, PHQ-9/GAD-7 outcomes, EEG findings, testimonials, podcast features |
| `apply.html` | Program overview + intake form (Monday.com embed) |
| `resources.html` | Mental Health Resources — VA, non-VA, peer support groups |
| `donate.html` | Donations (Zeffy embed — 100% passthrough) |
| `get-involved.html` | Volunteer / Partner / Sponsor |

Shared styles: `css/style.css`. Logo assets: `assets/`.

## Publish with GitHub Pages (free)

1. Go to github.com → **New repository** → name it `theayamission-site` (public) → Create.
2. On the repo page: **uploading an existing file** → drag ALL files/folders from this folder in → Commit.
3. Repo **Settings → Pages** → Source: "Deploy from a branch" → Branch: `main`, folder `/ (root)` → Save.
4. Site goes live in ~1 minute at `https://<your-username>.github.io/theayamission-site/`.

### Point theayamission.org at it

1. Repo Settings → Pages → Custom domain: enter `theayamission.org` → Save (this creates a CNAME file).
2. At your domain registrar (currently Squarespace), set DNS:
   - `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` record for `www`: `<your-username>.github.io`
3. Back in GitHub Pages settings, tick **Enforce HTTPS** once DNS propagates (up to 24h).

## Making changes

Ask Claude in Cowork — edits land in this folder, then re-upload the changed files to GitHub (or give Claude a GitHub token to push and publish directly).
