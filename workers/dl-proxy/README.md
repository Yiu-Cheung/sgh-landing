# dl-proxy — download counter

Cloudflare Worker that sits in front of the `sgh-downloads` R2 bucket, serves
files unchanged, and writes a data point to Analytics Engine for every
successful download.

## What it does

- Binds the R2 bucket as `BUCKET` — no public R2 URL needed.
- Serves every `GET` / `HEAD` on `dl.smartgalleryhub.com/*` from R2.
- On each `GET` of a first byte (not a later `Range:` chunk), writes one
  datapoint to the `sgh_downloads` Analytics Engine dataset with: object key,
  platform (`windows` / `mac-arm64` / `mac-intel` / ...), user agent, country,
  city.
- Range requests (pause/resume) are forwarded with `206 Partial Content` but
  don't double-count.

## Deploy

From `workers/dl-proxy/`:

```sh
npm install
npx wrangler deploy
```

The route in `wrangler.jsonc` (`dl.smartgalleryhub.com/*`) takes precedence over
the existing R2 public CNAME, so downloads start flowing through the Worker the
moment the route is published. Rollback: `npx wrangler delete dl-proxy`.

## Query download counts

Analytics Engine is queryable via the SQL API. Get an account-scoped API token
with `Account Analytics: Read`, then:

```sh
curl -s "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  --data "SELECT index1 AS platform, SUM(_sample_interval) AS downloads
          FROM sgh_downloads
          WHERE timestamp > NOW() - INTERVAL '7' DAY
          GROUP BY platform ORDER BY downloads DESC"
```

Common queries:

- Total downloads per platform, last 7 days — above.
- Downloads per day:
  ```sql
  SELECT toStartOfDay(timestamp) AS day, SUM(_sample_interval) AS downloads
  FROM sgh_downloads GROUP BY day ORDER BY day DESC
  ```
- Downloads per country:
  ```sql
  SELECT blob4 AS country, SUM(_sample_interval) AS downloads
  FROM sgh_downloads GROUP BY country ORDER BY downloads DESC
  ```

Blobs by position: `blob1`=key, `blob2`=platform, `blob3`=user-agent,
`blob4`=country, `blob5`=city.

## Caveats

- Analytics Engine samples at high volume; `SUM(_sample_interval)` gives an
  unbiased estimate, not an exact count.
- Bot traffic is counted. If that matters, add a user-agent filter in the
  Worker or in the SQL query.
- The Worker doesn't set `content-disposition: attachment`; browsers will honor
  R2's stored metadata. If existing `.exe`/`.dmg` already download correctly,
  no change needed.
