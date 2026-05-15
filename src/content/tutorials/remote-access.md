---
title: "Access Smart Gallery Hub from your phone"
description: "Open up SGH for remote access from your phone, tablet, or another computer — on the same network or over the internet. Local app, no cloud account."
order: 3
duration: "~5 min"
level: beginner
updatedDate: 2026-05-15
tags: [remote-access, mobile, web, ddns, server, pro]
---

Smart Gallery Hub runs on your desktop, but its web UI is reachable from any device on the same network — or over the internet if you open one port on your router. Five minutes of setup.

## 1. Enable the server

Open **Settings → Server**, toggle **Enable remote access** on, leave the port at the default (5173), and turn **HTTPS** on.

![Server settings panel with Enable remote access on, Port 5173, HTTPS on, DDNS Claim a free DDNS button, and Access URLs showing Local / LAN / WAN entries](/tutorials/remote-access/01-server-settings.png)

SGH lists the URLs you can reach the app on:

- **Local** — `https://localhost:5173` (this computer only)
- **LAN** — `https://192.168.x.x:5173` (other devices on your home network)
- **WAN** — your public IP, for access from outside your network

## 2. Set a password

Scroll down to **Authentication** and toggle **Require password** on. Set any password. This is the only thing standing between the internet and your gallery — pick a strong one.

![Authentication section with Require password toggled on and a Password field](/tutorials/remote-access/03-set-password.png)

## 3. Restart to apply

SGH prompts to restart so the server changes take effect.

![Restart now to apply your changes dialog with Cancel and Restart now buttons](/tutorials/remote-access/04-restart.png)

Click **Restart now**.

## 4. Pick the URL you'll use

Back in **Settings → Server**, look at the **Access URLs** block again:

- On your home Wi-Fi — use the **LAN** URL.
- From outside (mobile data, coffee shop, etc.) — use the **WAN** URL highlighted as `From your router (UPnP)`:

![WAN URL block: From your router (UPnP), https://218.103.167.38:5173, Reachable from outside if port 5000 is forwarded on your router](/tutorials/remote-access/02-wan-ip.png)

For WAN access to work, the port (5173) must be forwarded on your router. SGH attempts UPnP automatically; if your router has UPnP disabled, you'll need to add the rule yourself.

### Optional: claim a memorable URL (Pro)

Pro users can claim a free DDNS subdomain so you don't have to remember an IP address:

![Claim a remote URL dialog with my-home.portal.smartgalleryhub.com](/tutorials/remote-access/02b-claim-ddns.png)

Pick a name (e.g. `my-home`) and your remote URL becomes `https://my-home.portal.smartgalleryhub.com`. The DDNS service updates the address automatically if your home IP changes.

## 5. Open the URL on your phone

The first time, your browser will warn about the self-signed HTTPS certificate. This is expected — SGH generates a local cert on first run. Click **Advanced → Continue** (or your browser's equivalent).

![Chrome security warning: your connection is not private, NET::ERR_CERT_AUTHORITY_INVALID, with a continue link at the bottom](/tutorials/remote-access/05-browser-warning.png)

Then sign in with the password you set in step 2:

![Welcome back login page with a password field, Continue button, and note: No cloud account. Your gallery lives on your own machine — you're just unlocking it from a different network](/tutorials/remote-access/06-login.png)

The "No cloud account" note matters: there's no SGH server in the loop. The login goes straight to your home computer.

## 6. You're in

The mobile workspace is the same library, the same content-type folders, and the same action bar. Tap a folder, tick images, run AI, submit — all from a phone, while your desktop does the heavy lifting:

![Mobile workspace showing the Making Dumplings folder with 15 image thumbnails and a bottom action bar with Data, AI, Adobe, Shutter, Getty, Edit buttons](/tutorials/remote-access/07-mobile-workspace.png)

---

*Remote access and DDNS are Pro features. [Try Pro free for 30 days](/download).*
