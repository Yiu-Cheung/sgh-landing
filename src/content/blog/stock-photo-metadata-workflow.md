---
title: "The stock photo metadata workflow: from card import to live listing"
description: "An end-to-end workflow microstock contributors actually use — what each step costs in time, what's safe to automate, and where the human judgement matters."
publishDate: 2026-05-15
tags: [workflow, metadata, microstock, contributor]
---

If you've been doing microstock seriously for more than a few months, you've probably built — or quietly suffered through — some version of this workflow:

1. Pull cards from the camera.
2. Cull the bad shots.
3. Edit the good ones in Lightroom / Capture One / Photoshop.
4. Write titles, descriptions, and keywords.
5. Decide which agencies to submit to.
6. Reformat the metadata for each agency's quirks.
7. Upload to Adobe / Shutter / Getty (each portal slightly different).
8. Check approval status a week later, retry rejections.
9. Track earnings across three platforms.

Steps 1–3 are the fun part. Steps 4–9 are why most photographers stop uploading after the first month.

This post walks through a workflow that keeps steps 1–3 in your hands and offloads as much of 4–9 as is safe to offload.

## Step 1: import organised by content type

The single biggest workflow decision is the import folder structure. Two folders that look identical to the file system have very different metadata needs:

```
/microstock/
├── 2026-05-15-streets/        ← editorial: people, brands, news context
├── 2026-05-16-studio-coffee/  ← commercial: no identifiable people, no brands
├── 2026-05-17-ai-renders/     ← AI generated: must be disclosed
└── 2026-05-18-illustrations/  ← illustrations: vector or hand-drawn
```

The reason matters: editorial needs date and location prefixes, commercial needs marketable titles, AI-generated must be disclosed to the agency. **If you mix them in one folder and write generic metadata across the lot, half the photos get rejected for "wrong content type" or "missing editorial caption format".**

Tools that let you tag a folder as a content type (Commercial / Editorial / AI / Illustration) once at import — and then apply the right metadata format automatically — eliminate the most common rejection reason in microstock. Smart Gallery Hub does this through content-type workspaces.

## Step 2: cull, then AI

There's a common impulse to keyword everything you imported "just in case." Don't. Cull first, AI second:

1. Cull on a big screen. Keep the keepers, archive (don't delete) the rejects.
2. *Then* run the AI keywording on the keepers only.
3. Review what the AI wrote.

The order matters because AI on 500 photos when only 80 are submission-worthy is wasted compute (and on cloud-paid AI, wasted dollars). Local AI is cheap enough that the order is less critical, but the discipline still saves review time.

## Step 3: AI metadata pass

Drop the culled folder into your AI-aware tool. A few hints to feed the AI before it runs:

- **Location** (city, country) — if the EXIF doesn't already have GPS coordinates. Helps editorial captions, helps location-keywords for commercial.
- **Project context** — "fintech startup product shoot", "Berlin street photography May 2026". Steers the model toward the right concept keywords.
- **Forbidden words** — anything the model gets wrong consistently. If it keeps adding `cute` to your industrial shots, blacklist it once.

The AI fills title, description, and keywords for every image. Faster than typing; rarely perfect.

## Step 4: human review pass

This is the step every "just use AI" guide skips, and it's also the step that determines whether your portfolio actually sells.

For each image:

- **Audit specifics.** Did the AI claim `programmer` when the person is just sitting at a laptop? Strip it.
- **Add 5–10 concept / demographic / industry keywords** the AI couldn't see. (`Gen Z`, `remote work`, `Q2 planning`, etc. — see our [AI keywording guide](/blog/ai-keywording-for-stock-photos-what-works/) for the framing.)
- **Sanity-check editorial captions** — date and city correct? Description factual, not promotional?
- **Confirm content type** — really commercial? Really editorial?

A reasonable pace once you're warmed up: 20–30 seconds per image. For a 100-image batch, ~45 minutes including a coffee break. Compare to typing everything from scratch (~3 hours).

## Step 5: write metadata into the files

Save the metadata back into the JPEG itself, in the IPTC and XMP fields the agencies read. Two benefits:

1. The metadata survives even if you re-upload to a different agency, migrate tools, or rename folders.
2. Most agency upload endpoints (Adobe SFTP especially) parse IPTC on arrival, so you skip the "fill metadata per file" portal step entirely.

Write-back to file is a one-line operation in any decent metadata tool. Skip it and you lose this metadata the moment you move the files.

## Step 6: submission to multiple agencies

Each agency wants the file in a slightly different way:

- **Adobe Stock:** SFTP into your contributor folder + portal to file submission.
- **Shutterstock:** FTPS upload + their portal.
- **Getty / iStock:** S3-style upload + ESP portal.

Doing this by hand for three agencies × 100 images = enough manual work that you'll quietly skip Getty and just submit to Adobe + Shutter. Most contributors do.

A tool that uploads via each agency's native channel and drives the portal submission automatically is the difference between "I submit to three agencies" and "I submit when I have a free Sunday." Smart Gallery Hub handles the submission pipeline for all three.

## Step 7: track approval / rejection / earnings

After submission, you're back to checking three separate contributor portals. Adobe's review takes 1–7 days, Shutter ~2 days, Getty 1–4 weeks. Each portal shows acceptance count, rejection count, and earnings — independently.

Without aggregation:

- You log into 3 portals to see "did anything sell this week?"
- You forget to log into Getty for two months and miss that a third of your portfolio got rejected for fixable reasons.
- You don't notice which agency is paying you most until tax season.

With aggregation (any tool that scrapes the three portals into one dashboard), you see the rolling total in one place. Smart Gallery Hub does this; so do a couple of cloud submission services. Pick one or the other; the friction of *not* having it is real.

## What the time math looks like

Manual workflow on a 100-image shoot:

| Step | Time |
|---|---|
| Cull | 30 min |
| Keyword per image | 2 hours |
| Upload to 3 agencies (portal) | 1 hour |
| Track approvals weekly | 15 min × 4 weeks = 1 hour |
| **Total** | **~4.5 hours** |

With AI metadata + automated submission:

| Step | Time |
|---|---|
| Cull | 30 min |
| AI keyword + human review | 45 min |
| Submit to 3 agencies (one click) | 5 min |
| Approvals roll into one dashboard | 0 min |
| **Total** | **~1.3 hours** |

The savings is real (~3 hours per shoot). What you do with the time saved is up to you — shoot more, edit more carefully, or just close the laptop earlier.

---

*[Smart Gallery Hub](/) covers the whole pipeline — content-type folders, local AI metadata, IPTC/XMP write-back, SFTP / FTPS / S3 submission to Adobe, Shutterstock, and Getty, plus a unified earnings dashboard. [Try the free tier](/download); upgrade to Pro for the automated submission half.*
