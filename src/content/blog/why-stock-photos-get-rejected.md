---
title: "Why your stock photos get rejected — the 8 reasons agencies actually use"
description: "A working contributor's reference to the eight rejection reasons that account for most Adobe Stock, Shutterstock, and Getty rejections — and what you can fix before resubmitting."
publishDate: 2026-05-15
tags: [rejections, microstock, contributor, quality]
---

Every microstock contributor has the same first month: 20 photos in, 14 rejected, no clear reason in the email. The boilerplate rejection text is deliberately vague (`Quality issues`, `Trademark or third-party intellectual property`), so you spend a weekend guessing what went wrong.

Below is the practical list — the 8 rejection reasons that, in our experience, cover &gt;90% of microstock rejections. None of them are mysterious once you know what the reviewer is checking for.

## 1. Soft focus / wrong-plane focus

The single most common rejection. The image looks sharp on a 13-inch screen but is soft when the reviewer zooms to 100%. Common causes:

- Wide aperture with the subject's eyes outside the focus plane.
- Camera shake at slow shutter speeds.
- Focus locked on the wrong subject (foreground when the subject is mid-ground, etc.).

**Fix:** review every image at 100% before submitting. If you're shooting at f/1.8 for shallow depth, verify the focus point landed on the right feature.

## 2. Noise, banding, or sensor artifacts

Most common when the ISO went above ~3200, or you pushed shadows aggressively in post. Reviewers reject for noise even if the image otherwise looks fine on web.

**Fix:** if you must shoot high ISO, run a denoise pass before submitting. Don't over-sharpen — that amplifies noise. For very dark scenes, consider whether the photo is genuinely usable as stock or just usable on Instagram.

## 3. Trademark / logo / identifiable brand

A car badge, a phone screen showing a known app, a billboard, a Coca-Cola can — any of these will get a commercial photo rejected. Editorial photos can sometimes include them if the description is genuinely newsworthy, but commercial cannot.

**Fix:** clone out logos, or shoot with logos out of frame. For street scenes destined for commercial use, audit ruthlessly: every visible logo is a rejection waiting to happen. If you really want to keep the brand visible, route the photo to your **Editorial** workspace so the agency category gets set correctly.

## 4. Identifiable people without model release

Anyone whose face is clearly visible needs a signed model release before they can appear in commercial stock. Group shots, candid street photography, anyone facing the camera within ~15 feet — all require releases.

**Fix:** either get a release on the spot, or shoot the back of heads, blurred faces, or wide enough that no individual is identifiable. Or send the photo to your Editorial workspace, which doesn't require releases for newsworthy content but requires factual captioning instead.

## 5. Editorial submitted as commercial (or vice versa)

The classic content-type mix-up. An image of a protest, a brand-name product, or a recognisable building submitted under `Commercial` will fail trademark / release review. A clean studio shot submitted under `Editorial` will fail because there's no news context.

**Fix:** organise your library by content type before metadata, not after. A tool that tags folders as Commercial / Editorial / AI Generated and applies different caption formats per type prevents this rejection entirely. Smart Gallery Hub does this through [content-type folders](/#features).

## 6. Wrong or missing editorial caption format

Editorial images need a specific caption format: `DATE - CITY, COUNTRY: factual description.` If your editorial caption reads "Beautiful sunset over the city", the portal will reject it before a human reviews. Same if the date is missing, the location is missing, or the description uses promotional language.

**Fix:** pull date and location from the EXIF / GPS data when you can — that's the simplest way to never get this rejection. If your tool can reverse-geocode GPS coordinates into "Berlin, Germany" automatically, the editorial caption writes itself.

## 7. Keyword spam

Adding 50 loosely-related keywords ("business, success, money, finance, growth, …") to an image of a flower will get the photo flagged. Agencies dedupe synonyms and demote images with weak keyword precision.

**Fix:** 20 strong, accurate keywords beat 50 mediocre ones. Strip synonyms (`car`, `vehicle`, `automobile` → pick one). Avoid abstract concepts that aren't visually present. The agency's search algorithm tracks how often each keyword leads to a *purchase*, and demotes images that mismatch.

## 8. Similar images / "same shoot, too many"

If you submit 12 nearly-identical photos of the same subject from the same angle, the agency will accept 2 or 3 and reject the rest as `Similar set`.

**Fix:** before submitting, cull aggressively. Pick the 2 best variants and discard the others (or save them for non-stock use). A workflow tool that EXIF-stamps submitted files (so you don't accidentally resubmit) helps here — once a frame is stamped, it stays out of future batches.

## What you can automate vs. what you have to look at

| Rejection | Catchable by tool? |
|---|---|
| Soft focus | No — needs your eye |
| Noise | No — needs your eye |
| Trademark / logo visible | No — needs your eye |
| Identifiable people no release | No — needs your eye |
| **Editorial vs Commercial mix-up** | **Yes — content-type workspaces** |
| **Editorial caption format wrong** | **Yes — GPS-aware AI auto-fill** |
| Keyword spam | Partial — your tool can dedupe synonyms; the *quality* call is yours |
| **Re-submitting the same file** | **Yes — EXIF-stamping after submit** |

The first four still need your editorial judgement. The last four are where tooling earns its keep — and where, frankly, most of our user-reported rejections were happening before they automated the type system and the EXIF stamping.

---

*Building a workflow that prevents the bottom-four rejections by design? [Smart Gallery Hub](/#features) handles content-type routing, GPS editorial captions, keyword limits, and submission stamping — locally, with the AI on your machine.*
