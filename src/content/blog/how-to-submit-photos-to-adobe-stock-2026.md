---
title: "How to submit photos to Adobe Stock: the contributor's 2026 guide"
description: "Step-by-step walkthrough of submitting photos to Adobe Stock as a contributor — account setup, SFTP vs portal upload, metadata requirements, common rejections, and how to scale beyond manual submission."
publishDate: 2026-05-15
tags: [adobe-stock, contributor, submission, microstock]
---

Adobe Stock is the highest-paying agency in the three-major bracket and usually the first place serious microstock contributors learn the ropes. The contributor experience has changed three or four times in recent years, so here's a current, end-to-end walkthrough.

## Step 1: become a contributor

1. Go to [https://contributor.stock.adobe.com/](https://contributor.stock.adobe.com/).
2. Sign in with your Adobe ID (the same one you use for Creative Cloud, if you have one).
3. Accept the Contributor Agreement. You'll be asked for tax info (W-9 for US, W-8BEN for non-US contributors) and a payout method — set this up before you submit, because Adobe holds royalties until your tax form is on file.
4. New contributors start without an upload track record. Your first 5–10 submissions get extra-careful human review; once you have ~50 accepted images, automated checks dominate.

## Step 2: prep your photos

Before you touch the upload panel, get the files ready:

- **Format:** JPEG, sRGB color profile, embedded ICC profile, full quality (90–100).
- **Resolution:** minimum 4 megapixels. Practically, 12 MP+ is standard.
- **No watermark, no signature, no border.** Adobe rejects on sight.
- **Editorial photos** need date and location in the description (`DATE - CITY, COUNTRY: factual description`). Commercial photos need marketable titles and keywords.

Save the prepped JPEGs into a folder you can re-find. You'll be coming back to it.

## Step 3: pick an upload channel

Adobe gives contributors two ways to upload:

### a) Browser portal (drag and drop)

Sign in at the contributor portal, click `Upload`, drag a batch of JPEGs into the dropzone. The portal handles 1 to ~50 files at a time before the experience degrades.

**Good for:** your first ~100 images, or one-off submissions. **Bad for:** anyone doing volume — the portal is slow, lossy on transient network drops, and asks you to fill metadata one image at a time afterward.

### b) SFTP upload

Adobe provisions every contributor an SFTP endpoint. Drop the files into the `incoming` folder via any SFTP client (FileZilla, WinSCP, Cyberduck). The files appear in your portal queue ready for metadata.

**Good for:** anything beyond ~50 files. SFTP is what every serious contributor uses. **Bad for:** the credentials live in a config file or password manager — easy to mis-type once and lock yourself out.

A workflow tool that handles SFTP for you (so you never see the credentials) eliminates the second problem. Smart Gallery Hub uploads via Adobe's SFTP endpoint and then drives the portal to file metadata — no manual upload, no per-image typing.

## Step 4: write metadata

Every uploaded file needs:

- **Title:** 5–200 characters. For commercial: descriptive + marketable. For editorial: factual.
- **Keywords:** 5–49 (Adobe accepts up to 49). Quality &gt; quantity — strong, accurate keywords beat padded lists.
- **Category:** Adobe's category dropdown — pick the most specific match.
- **Releases:** signed model and property releases attached if relevant.

You can fill metadata one image at a time in the portal, or write it into the file's IPTC fields before uploading (Adobe reads embedded IPTC/XMP). The IPTC route is faster and your metadata survives even if you re-upload or migrate to another agency.

## Step 5: submit and wait

Once metadata is complete, click `Submit for Review`. Adobe's automated checks run within minutes; human review typically takes 1–7 days (slower for new contributors, faster once you have a track record).

You'll get an email per image, accepted or rejected. Accepted images go live within ~24 hours. Rejected images get a short reason — see our [rejection reasons guide](/blog/why-stock-photos-get-rejected/) for what each one actually means.

## What's worth automating

Manual submission breaks down at three points:

1. **Repeated SFTP / portal navigation** — 100 files = 100 clicks if you're doing this by hand. SFTP + a workflow tool kills this.
2. **Filling metadata per file** — the portal makes you do this one at a time. Tools that batch-apply metadata (or generate it via AI per folder) win back hours.
3. **Tracking acceptance / rejection** — Adobe sends per-image emails. Without aggregation, you're searching your inbox to know what got through. A tool that scrapes the contributor portfolio gives you the dashboard view.

[Smart Gallery Hub](/#features) handles all three. Drop a folder, AI writes metadata, files go via SFTP, submissions get filed in the portal, and the approval/rejection counts come back into one dashboard alongside your Shutterstock and Getty results.

## Earnings reality check

Adobe Stock's contributor royalty is **33% for photos and 35% for videos** under the Subscription model — paid on the subscription value of each download. The Standard royalty (per-licence sales) ranges from $0.33 to a few dollars per sale.

For a baseline: a contributor uploading ~100 images a month tends to see *something* start coming in around month 3–6, with meaningful (&gt;$50/mo) earnings emerging once the portfolio passes ~500 images. Quality and theme matter more than count past that point.

## TL;DR

- Become a contributor + complete tax forms before submitting.
- Prepare files: JPEG, sRGB, 4 MP+, no watermark.
- Use SFTP, not the portal dropzone, for any batch beyond ~50 files.
- Embed IPTC/XMP metadata in the file before uploading; saves time across agencies.
- Editorial photos need `DATE - CITY, COUNTRY:` caption format.
- Automate the repetitive parts so your evening goes to shooting, not clicking.

---

*[Smart Gallery Hub](/) automates the Adobe Stock submission pipeline — AI metadata generation, SFTP upload, portal submission, approval tracking — all from your desktop. [Try the free tier](/download), upgrade to Pro for the automated submission.*
