---
title: "Getting started with Smart Gallery Hub"
description: "Install Smart Gallery Hub, set up local AI metadata generation, add your first workspace, and run your first batch of stock photo keywording — in about 15 minutes."
order: 1
duration: "~15 min"
level: beginner
updatedDate: 2026-05-15
tags: [getting-started, installation, ollama, workspace]
---

This tutorial walks you through your first 15 minutes with Smart Gallery Hub: install the app, plug in a local AI model, add a folder, generate metadata, and review the output. No agency credentials needed for this walkthrough — that comes in [the submission tutorial](/tutorials/) (coming next).

By the end you'll have a working library, AI-generated metadata on a real folder of photos, and the metadata written back into your image files.

## What you'll need

- Windows 10+ (64-bit) or macOS (Apple Silicon or Intel).
- A folder of photos to test on (50–200 images is comfortable; more is fine).
- ~8 GB free disk space (the AI model takes most of this).
- ~15 minutes of attention.

## Step 1: Download and install

1. Open [smartgalleryhub.com/download](/download) on the computer you'll use for SGH.
2. Click the **Windows** or **Mac** download card — the installer downloads from `dl.smartgalleryhub.com` (the same Cloudflare R2 bucket Pro builds publish to).
3. Run the installer.
   - **Windows:** NSIS installer, ~150 MB. Pick a destination, click through.
   - **Mac:** open the `.dmg`, drag SGH into Applications, then right-click → Open the first time (macOS requires the right-click for first launch of unsigned apps).
4. Launch Smart Gallery Hub. You'll see the welcome screen.

The first launch creates a small SQLite database in your user profile. Nothing is sent anywhere; this is purely local.

## Step 2: Activate the 30-day Pro experience

The Free tier is permanent and runs forever. For the first 30 days you also get every Pro feature — so you can try the automated submission, approval tracking, and earnings dashboard before deciding if you need them.

- No credit card.
- No email signup.
- The trial activates the first time you launch and is per-machine.

After 30 days, Pro features disable; AI metadata, content-type folders, keyword editing, and write-to-file stay Free forever.

## Step 3: Install Ollama (the local AI runtime)

Smart Gallery Hub uses a local vision model via [Ollama](https://ollama.com/) — same as the major desktop LLM apps. The benefit: AI runs entirely on your machine. Your images never leave your computer.

1. Open [ollama.com/download](https://ollama.com/download) and install Ollama for your platform. The installer is small (~500 MB).
2. After install, Ollama runs as a background service on `http://localhost:11434`. You don't need to interact with it; SGH talks to it directly.
3. Pull a vision model. From a terminal:

   ```
   ollama pull llava
   ```

   `llava` is a solid general-purpose vision model (~4 GB). On modern CPUs it processes ~1 image every 5–10 seconds; with a discrete GPU it's much faster.

   Smaller, faster alternative: `ollama pull moondream` (~1.5 GB). Faster but slightly less detailed captions.

4. Back in SGH, open **Settings → AI** and pick your model from the dropdown. SGH auto-detects what Ollama has pulled.

## Step 4: Add your first workspace

Workspaces are folders SGH watches. Each workspace carries a **content type** that tells the AI which caption format to write.

1. Click **+ Add workspace** (top-left).
2. Browse to a folder of test photos.
3. Pick a content type:
   - **Commercial** — typical stock work, no identifiable people, no logos. AI writes marketable titles + concept keywords.
   - **Editorial** — news / documentary / identifiable people. AI writes `DATE - CITY, COUNTRY:` factual captions, auto-filling location from GPS when available.
   - **AI Generated** — anything you produced with a generative AI model. Must be disclosed to agencies.
   - **Illustration** — vector or hand-drawn.
4. Click **Add**. SGH scans the folder and shows thumbnails in the grid view.

For your first run, start with **Commercial** if you have a typical stock folder, or **Editorial** if you have travel / street / news shots with GPS data.

## Step 5: Run AI metadata

With the workspace selected:

1. Click **Operate** in the right panel (or the bottom action bar on mobile).
2. Click the **AI** action button.
3. (Optional) Set folder-level hints — a project context phrase, a forced location, must-have keywords. Hints apply to every image in the batch and dramatically improve accuracy.
4. Click **Run**.

SGH processes images one at a time (or in parallel if your hardware supports it). For each image, you'll see:

- A **green AI badge** appear on the thumbnail when metadata is generated.
- Title, description, and keywords populate the metadata panel on the right when you click the image.

Expect ~5–10 seconds per image on CPU, ~1–2 seconds on GPU. A 100-image folder is ~10 minutes on CPU; ~3 minutes on GPU.

## Step 6: Review and edit

AI gets you 70% of the way. The remaining 30% is human judgement — and it's where the keyword quality that drives sales comes from.

For each image:

- **Title:** read it. Edit if generic. Stock buyers search title; vague titles get buried.
- **Description:** for commercial, evocative; for editorial, factual.
- **Keywords:** strip duplicates and synonyms. Add 5–10 concept / industry / demographic keywords the AI couldn't see (`Q2 planning`, `hybrid work`, `Gen Z`, etc.).

Use the **multi-select + bulk edit** tools at the top of the keyword editor to do this fast: select 10 similar images, add a shared concept keyword, done in seconds.

## Step 7: Write metadata into the files

Once metadata is clean:

1. Select all images in the workspace.
2. Click **Operate → Data**.
3. SGH writes the metadata into each file's IPTC and XMP fields.

This step matters because:

- The metadata survives if you move the file, rename the folder, or migrate to another tool.
- Most agency upload endpoints (Adobe SFTP especially) read embedded IPTC, so you skip the "fill metadata per file" step in the contributor portal.

On the **Free tier**, the first 30 keywords per image are written to the file. On **Pro**, up to 50.

## Step 8: What's next

You now have:

- A workspace tagged with a content type.
- AI-generated metadata reviewed and edited.
- Metadata written into your photo files.

What you don't have yet: the photos in front of an agency reviewer. That's the submission half of the workflow.

### Two paths from here

- **Free path:** export your library to a CSV in each agency's exact format (`Operate → Export`). Upload manually via each contributor portal.
- **Pro path:** add your Adobe / Shutterstock / Getty credentials in **Settings → Submission Credentials**, then click **Operate → Adobe** (or Shutter, or Getty) to upload and file submission automatically. Approval status comes back into the **Approval** tab.

The submission tutorial walks through both paths in detail.

---

*Ready to go further? [Browse all features](/#features), [read the blog](/blog/), or [download the app](/download) if you haven't already.*
