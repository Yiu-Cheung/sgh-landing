---
title: "Set up your agency credentials"
description: "Connect Smart Gallery Hub Pro to Adobe Stock, Shutterstock, and Getty / iStock — portal logins for the metadata side, SFTP / FTPS / S3 credentials for the upload side. Stays local; SGH never sends your credentials anywhere."
order: 2
duration: "~10 min"
level: beginner
updatedDate: 2026-05-15
tags: [credentials, adobe-stock, shutterstock, getty, submission, pro]
---

If you finished [Getting started with Smart Gallery Hub](/tutorials/getting-started/), you have AI metadata running locally on your machine. The next step — and the reason you'd upgrade from Free to Pro — is letting SGH submit those photos to the three major microstock agencies for you.

This tutorial walks through the credentials each agency needs and how to test them before your first real submission. About 10 minutes if you have your agency logins handy.

## Before you start

You need active contributor accounts at the agencies you want to submit to. If you don't have one yet:

- **Adobe Stock:** [contributor.stock.adobe.com](https://contributor.stock.adobe.com/)
- **Shutterstock:** [submit.shutterstock.com](https://submit.shutterstock.com/)
- **Getty / iStock:** [contributor.gettyimages.com](https://contributor.gettyimages.com/)

Get the account approved (Adobe especially does a manual review of new applicants) before continuing. You also need at least 30 days remaining on your Pro experience or an active Pro license — credential storage and submission are gated behind Pro.

## Step 1: Open Settings

Smart Gallery Hub keeps credentials in its own settings panel, encrypted on your disk.

1. Click the **Smart Gallery Hub** title in the top-left of the app to open the main menu.
2. Click **Settings**.

![Smart Gallery Hub main menu dropdown with Account and License, Settings, Check for update, About, and Exit options](/tutorials/credential-setup/01-open-settings-menu.png)

The Settings window opens. On the left you'll see grouped sections: **App** (General / Appearance / Account & License), **AI** (AI Model Configs), **Microstock** (Submission / Credentials / Earning History), and **System** (Server).

Click **Credentials** under the **Microstock** group.

## Step 2: Configure Adobe Stock

Adobe Stock needs two pairs of credentials — one for the contributor portal (used for filing the submission), and one for the SFTP endpoint (used for the actual file upload).

![Settings → Credentials view with Adobe Stock enabled, Portal Email / Portal Password / Test login session button, SFTP Username / SFTP Password / Test SFTP Login button visible, ShutterStock section starting below](/tutorials/credential-setup/02-credentials-panel.png)

Steps:

1. **Toggle Adobe Stock on** (top-left switch).
2. **Portal Email + Portal Password:** the email and password you use to sign in at `contributor.stock.adobe.com`.
3. Click **Test login session**. SGH opens a headless browser, signs into the contributor portal once, and saves the session cookie locally. If it succeeds you'll see a green check; if it fails (wrong password, MFA challenge, captcha), the error appears below the button.
4. **SFTP Username + SFTP Password:** Adobe provisions these separately when you become a contributor. They're shown under your contributor profile → **Connections** → **SFTP**. Click **Show my SFTP info** to open the Adobe page in a browser if you need to look them up.
5. Click **Test SFTP Login**. SGH connects to Adobe's SFTP endpoint, verifies it can list your `incoming` folder, then disconnects.

Two greens = Adobe is ready.

## Step 3: Configure Shutterstock

Scroll down to the **ShutterStock** section in the same Credentials view.

1. **Toggle ShutterStock on.**
2. **Username / Email + Password:** the credentials you sign in with at `submit.shutterstock.com`.
3. Click **Test login session** (same flow as Adobe). The session cookie is saved locally so subsequent submissions don't need to re-authenticate.

Shutterstock uses FTPS (FTP over TLS) for the file upload side, but unlike Adobe it uses the same username/password as the portal login. There's no separate FTPS credential to configure.

Two checks: portal login green, FTPS reachable (SGH tests this automatically when you toggle the section on).

## Step 4: Configure Getty / iStock

Scroll further down to the **Getty / iStock** section.

1. **Toggle Getty on.**
2. **ESP Username + Password:** the credentials for the Getty Contributor ESP portal (`contributor.gettyimages.com`).
3. Click **Test login session**.

Getty uses S3-style upload behind the scenes. SGH handles the S3 credential exchange automatically once portal login works — no separate keys to paste.

## Step 5: Verify each connection

Back in the main app, the top status strip should now show a row per agency:

```
ADOBE     ●  none — 143    uploaded ●     submitted ●     approved ●     rejected ●
SHUTTER   ●  none — 0      uploaded ●     submitted ●     approved ●     rejected ●
GETTY     ●  none — 0      uploaded ●     submitted ●     approved ●     rejected ●
```

Each agency row is colour-coded (Adobe blue, Shutter red, Getty green). All counts at zero is normal — you haven't submitted anything yet. The strip will fill in once you run your first batch.

If an agency row is **grey** or missing, the credentials test didn't pass. Go back into Settings → Credentials, check the failing test, and try again.

## Step 6: Where credentials live on disk

For transparency:

- Portal cookies are stored in `~/.config/SmartGalleryHub/profile_<agency>/` (or Windows equivalent under `%APPDATA%`).
- Plaintext passwords are kept in an OS-keychain entry (macOS Keychain / Windows Credential Manager) — not in any config file.
- SGH talks to Adobe / Shutter / Getty endpoints directly. No credential ever transits a server of ours.

You can wipe all stored credentials any time via **Settings → Credentials → Clear all** (link at the bottom of the panel).

## What's next

You're now ready to actually submit. From the main workspace:

1. Tick the images you want to submit.
2. Click **Operate → AI** if you haven't already generated metadata.
3. Click **Operate → Adobestock** / **Shutterstock** / **Getty / iStock**. SGH uploads the files via SFTP / FTPS / S3, then drives the portal to file the submission.
4. Watch the status strip update — `uploaded`, then `submitted`, then `approved` / `rejected` as the agencies review.

The next tutorial — *Submitting your first batch* — covers what to expect on the first run, how SGH handles re-tries on transient failures, and how the EXIF stamp prevents accidentally resubmitting the same image twice.

---

*[Smart Gallery Hub](/) keeps every credential local and encrypted. Nothing leaves your machine. [Try the free tier](/download); upgrade to Pro for the automated submission half.*
