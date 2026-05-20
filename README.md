# Lunch Angels — Storyboard

Production storyboard tool for the **DEF Gala 2026** fundraising film, *Lunch Angels*
(school-lunch debt in Davis County). Live at **https://storyboard.daviskids.org**.

This repo is the source of truth for the worker. It was reverse-captured from the

## 🎬 Working on the film? → **[docs/WAKE-UP.md](docs/WAKE-UP.md)** (read first), then [docs/START-HERE.md](docs/START-HERE.md)
Single entry point for the Lunch Angels gala film (story, script, locked style, characters). Read it first.

deployed Cloudflare Worker on 2026-05-19 — previously the code existed only on the
Cloudflare edge with no version control (classic deploy drift). Now fixed.

## What it is

A single Cloudflare Worker that serves both the API and the frontend. Reviewers
sign in via magic link (allow-listed emails), browse the 22-shot board, generate
and pick winning images per shot, and leave comments.

- **Auth:** magic link → email via `mail.fosterlabs.org/send`. Allow-list in
  `ALLOWED_EMAILS` at top of `worker.js`. Sessions in KV/D1, 30-day window.
- **Storage:** D1 (`storyboard-db`) for shots/characters/style refs/comments/sessions;
  R2 (`storyboard-images`) for image candidates + winners.

## Bindings

| Binding   | Type | Resource                               |
|-----------|------|----------------------------------------|
| `DB`      | D1   | `storyboard-db` (`790c1af9-…aa8e`)     |
| `IMAGES`  | R2   | `storyboard-images`                    |
| `SESSIONS`| KV   | `95b6a4503c3a4d1f8c295c11573a5da4`     |
| `MAIL_TOKEN` | secret | SkippyMail bearer (NOT in repo)     |

## Deploy

```bash
npm i -g wrangler          # or use npx
wrangler secret put MAIL_TOKEN   # paste the SkippyMail bearer — required for sign-in emails
wrangler deploy
```

### ⚠️ Repo vs. live delta (read before first deploy)

The **live** worker currently hardcodes the SkippyMail token inline. This repo
redacts it to `env.MAIL_TOKEN` so no credential lands in git. The `MAIL_TOKEN`
secret has been set on the worker, so a `wrangler deploy` from this repo is
behavior-identical to live — sign-in emails will keep working. The only change
on first deploy is that the token moves from inline → secret. (The token itself
was not rotated.)

## Data model (`shots`)

Each shot row carries the full production payload:
`title, time_code, shot_type, aspect, description, chatgpt_prompt`
(image-gen prompt), `flow_motion_prompt` (video/motion prompt), `notes`,
`character_refs`, `status`, `winner_image_key`, `start_frame_key`,
`end_frame_key`, `candidate_keys`, `video_candidate_keys`, `winner_video_key`,
`vo_quote`, `vo_who`.

## Files

- `worker.js` — the deployed worker (redacted token).
- `wrangler.toml` — bindings + deploy config.
- `schema.sql` — full D1 schema (tables + indexes).
- `content-backup.json` — snapshot of authored content (shots/characters/style_refs/comments)
  as of 2026-05-19. Images live in R2, **not** here — back those up separately.

## Restore

```bash
wrangler d1 execute storyboard-db --remote --file=schema.sql   # tables
# content: re-insert from content-backup.json (shots etc.) as needed
```
