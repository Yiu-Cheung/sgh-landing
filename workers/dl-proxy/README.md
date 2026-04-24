# dl-proxy — download counter

Cloudflare Worker that sits in front of the `sgh-downloads` R2 bucket, serves
files unchanged, and increments a per-platform counter in Workers KV on every
successful download. Free plan only; no Analytics Engine writes.

## What it does

- Binds the R2 bucket as `BUCKET` — no public R2 URL needed.
- Serves every `GET` / `HEAD` on `dl.smartgalleryhub.com/*` from R2.
- On each `GET` of a first byte (not a later `Range:` chunk), does one KV
  write: `INCR DL_COUNTERS.platform:<name>` where `<name>` is one of
  `windows`, `mac-arm64`, `mac-intel`, `mac`, `other`.
- Range requests (pause / resume) are forwarded as `206` and don't
  double-count.

## Deploy

From `workers/dl-proxy/`:

```sh
npm install
npx wrangler deploy
```

The route in `wrangler.jsonc` (`dl.smartgalleryhub.com/*`) takes precedence
over the existing R2 public CNAME, so downloads start flowing through the
Worker the moment it's published. Rollback: `npx wrangler delete dl-proxy`.

## Read download counts

From `workers/dl-proxy/`:

```sh
# all per-platform keys
npx wrangler kv key list --binding DL_COUNTERS

# individual counter
npx wrangler kv key get --binding DL_COUNTERS "platform:windows"
npx wrangler kv key get --binding DL_COUNTERS "platform:mac-arm64"
npx wrangler kv key get --binding DL_COUNTERS "platform:mac-intel"
```

Total = sum of all `platform:*` values.

## Caveats

- KV is **eventually consistent** (~60s propagation). Counts lag new downloads
  by up to a minute.
- Concurrent downloads can race the read-modify-write and drop a count
  occasionally. At this scale (hand-tested, low concurrency) the drift is
  negligible.
- KV free tier: 1,000 writes / day. One download = one write, so this caps at
  roughly 1,000 downloads / day before KV usage is billable. If that matters,
  aggregate platforms client-side or move to Durable Objects.
- Bot traffic is counted.
