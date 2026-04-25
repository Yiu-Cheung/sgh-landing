// Pure validator + DOM applier for release metadata. Consumed by:
//   - download.astro (build-time embed via Astro frontmatter)
//   - The inline runtime fetch script in download.astro
//
// Pure functions — no side effects beyond the passed Document. No Date.now().
// The schema is defined by V3's `release-pipeline` capability spec at
// openspec/specs/release-pipeline/spec.md (in the V3 repo).
//
// Spec scenarios this module enforces:
//   - Page renders dynamic version when fetch succeeds
//   - Fallback renders when JSON is malformed
//   - Fallback renders when schemaVersion is unsupported
//   - Empty highlights array displays maintenance-release fallback copy

export interface UpdateJsonPlatforms {
  win: string;
  mac: string;
}

export interface UpdateJson {
  schemaVersion: 1;
  version: string;
  releasedAt: string;
  platforms: UpdateJsonPlatforms;
  highlights: string[];
  fullChangelog: string;
}

/**
 * Strict validator. Returns the typed object on valid input, null otherwise.
 *
 * Fails closed on schemaVersion mismatch — see release-pipeline producer-trust
 * contract: schemaVersion only increments on breaking changes, so a v2 payload
 * is by definition not safely consumable by a v1 reader. DO NOT loosen this
 * check casually.
 */
export function validateUpdateJson(data: unknown): UpdateJson | null {
  if (data === null || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  if (d.schemaVersion !== 1) return null;
  if (typeof d.version !== "string" || d.version.length === 0) return null;
  if (typeof d.releasedAt !== "string" || d.releasedAt.length === 0) return null;
  if (typeof d.fullChangelog !== "string" || d.fullChangelog.length === 0) return null;

  if (d.platforms === null || typeof d.platforms !== "object") return null;
  const p = d.platforms as Record<string, unknown>;
  if (typeof p.win !== "string" || typeof p.mac !== "string") return null;

  if (!Array.isArray(d.highlights)) return null;
  if (!d.highlights.every((item) => typeof item === "string")) return null;

  return {
    schemaVersion: 1,
    version: d.version,
    releasedAt: d.releasedAt,
    platforms: { win: p.win, mac: p.mac },
    highlights: d.highlights as string[],
    fullChangelog: d.fullChangelog,
  };
}

/**
 * DOM mutator. Applies validated update info to the document:
 *   - Sets text content of every [data-sgh-version] element to "v{version}".
 *   - Replaces children of [data-sgh-highlights] with either:
 *       - <li> items per highlight (when non-empty), OR
 *       - the maintenance-release fallback copy (when empty).
 *
 * The maintenance-release copy reads:
 *   "No new features in this release — bug fixes and stability improvements.
 *    See full changelog for details."
 *
 * The "full changelog" text is rendered as an <a href={fullChangelog}> link.
 *
 * Pure: only side effect is on the passed Document. Defaults to global
 * `document` so the runtime script can call `applyUpdate(data)` without args;
 * tests pass a jsdom Document explicitly.
 */
export function applyUpdate(data: UpdateJson, doc: Document = document): void {
  const versionLabel = `v${data.version}`;
  doc.querySelectorAll<HTMLElement>("[data-sgh-version]").forEach((el) => {
    el.textContent = versionLabel;
  });

  const highlightsContainers = doc.querySelectorAll<HTMLElement>(
    "[data-sgh-highlights]",
  );
  highlightsContainers.forEach((el) => {
    while (el.firstChild) el.removeChild(el.firstChild);

    if (data.highlights.length === 0) {
      const span = doc.createElement("span");
      span.textContent =
        "No new features in this release — bug fixes and stability improvements. See ";
      el.appendChild(span);

      const a = doc.createElement("a");
      a.href = data.fullChangelog;
      a.textContent = "full changelog";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      el.appendChild(a);

      el.appendChild(doc.createTextNode(" for details."));
      return;
    }

    for (const text of data.highlights) {
      const li = doc.createElement("li");
      li.textContent = text;
      el.appendChild(li);
    }
  });
}
