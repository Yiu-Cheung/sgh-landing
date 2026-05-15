---
title: "Getting started with Smart Gallery Hub"
description: "Install SGH, run AI metadata on your first folder, and submit."
order: 2
duration: "~15 min"
level: beginner
updatedDate: 2026-05-15
tags: [getting-started, installation, ollama, workspace]
---

## 1. Install Smart Gallery Hub

[Download](/download) for Windows or Mac → run the installer → launch.

### Windows

Run `SGH-Setup.exe` → follow the installer → done.

### Mac — first-launch warning

SGH is not Apple-notarised, so macOS blocks the first launch. Two extra clicks to allow it:

**a.** Double-click `SGH - Smart Gallery Hub.app`. macOS shows:

![macOS first-launch dialog: "SGH - Smart Gallery Hub" Not Opened, with Done and Move to Bin buttons](/tutorials/getting-started/macos-01-not-opened.png)

Click **Done** (do **not** Move to Bin).

**b.** Open the Apple menu → **System Settings…**:

![Apple menu showing System Settings option](/tutorials/getting-started/macos-02-system-settings.png)

**c.** Go to **Privacy & Security**. Scroll to the **Security** section. You'll see "SGH - Smart Gallery Hub was blocked". Click **Open Anyway**:

![Privacy & Security panel with SGH blocked notice and Open Anyway button](/tutorials/getting-started/macos-03-open-anyway.png)

**d.** macOS asks one more time. Click **Open Anyway**:

![Second confirmation dialog asking to open SGH](/tutorials/getting-started/macos-04-confirm-open.png)

SGH launches. You only need to do this once.

## 2. Install Ollama

Install [Ollama](https://ollama.com/download) for your platform.

SGH auto-downloads the vision + extract models on first run. Confirm in **Settings → AI Model Configs**:

![AI Model Configs panel](/tutorials/getting-started/02-ai-config.png)

## 3. Add a folder

Click **+ Add folder** → browse to your folder → pick a content type:

![Content type popover](/tutorials/getting-started/01-content-type-select.png)

| Type | When |
|---|---|
| **Commercial** | No people, no logos |
| **Editorial** | News / documentary (GPS auto-fills caption) |
| **AI Generated** | Made with generative AI |
| **Illustration** | Vector / hand-drawn |

![Workspace view](/tutorials/getting-started/02-workspace-view.png)

## 4. Set AI hints (optional)

![AI Hints panel](/tutorials/getting-started/03-ai-hints.png)

Add a Category, must-have Keywords, or Location to sharpen the AI's output for the whole batch.

## 5. Run AI

**Operate → AI**. Click any thumbnail to review:

![Metadata panel](/tutorials/getting-started/05-metadata-panel.png)

Edit the title/keywords if generic.

## 6. Submit

**Operate → Adobestock / Shutterstock / Getty**:

![Operate panel](/tutorials/getting-started/04-operate-panel.png)

Smart Submit skips already-submitted files, skips files without metadata, retries failures, and resumes after interruptions.

You need agency credentials first → [Set up your agency credentials](/tutorials/credential-setup/).

## 7. Check approval

Open a submitted image's **Operate** tab → **Check Approval**:

![Operate tab with Check Approval button](/tutorials/getting-started/06-operate-submit.png)

Status flows back into the workspace status strip.

## 8. Fetch earnings

Open **MS-Report** tab → **Fetch Earnings** (or **Backfill History** for past data):

![MS-Report tab](/tutorials/getting-started/07-ms-report.png)

Filter by Adobe / Shutter / Getty to see who pays most.
