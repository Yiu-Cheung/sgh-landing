// @vitest-environment jsdom
//
// Spec scenarios from openspec/specs/landing-site/spec.md (V3 repo):
//   - "Download page renders dynamic version when fetch succeeds"
//   - "Fallback renders when JSON is malformed"
//   - "Fallback renders when schemaVersion is unsupported"
//   - "Empty highlights array displays maintenance-release fallback copy"
import { describe, it, expect } from "vitest";
import {
  validateUpdateJson,
  applyUpdate,
  type UpdateJson,
} from "../release-info";

const VALID_INPUT: UpdateJson = {
  schemaVersion: 1,
  version: "0.2.0",
  releasedAt: "2026-04-25T18:30:00Z",
  platforms: {
    win: "https://dl.smartgalleryhub.com/v0.2.0/SGH-Setup-0.2.0.exe",
    mac: "https://dl.smartgalleryhub.com/v0.2.0/SGH-0.2.0-universal.dmg",
  },
  highlights: [
    "Custom title bar with built-in min/max/close buttons",
    "Single Mac download for Intel and Apple Silicon",
  ],
  fullChangelog:
    "https://github.com/Yiu-Cheung/Microstock-AiTools-V3/releases/tag/v0.2.0",
};

describe("validateUpdateJson — happy path", () => {
  it("returns the parsed object on valid input", () => {
    const result = validateUpdateJson(VALID_INPUT);
    expect(result).not.toBeNull();
    expect(result?.version).toBe("0.2.0");
    expect(result?.schemaVersion).toBe(1);
  });

  it("accepts pre-release version strings", () => {
    expect(validateUpdateJson({ ...VALID_INPUT, version: "0.2.0-rc.1" })).not.toBeNull();
  });

  it("accepts empty highlights array", () => {
    expect(validateUpdateJson({ ...VALID_INPUT, highlights: [] })).not.toBeNull();
  });
});

describe("validateUpdateJson — schemaVersion strictness (fail closed)", () => {
  it("rejects schemaVersion: 2 (unsupported per producer-trust contract)", () => {
    expect(validateUpdateJson({ ...VALID_INPUT, schemaVersion: 2 })).toBeNull();
  });

  it("rejects schemaVersion: 0", () => {
    expect(validateUpdateJson({ ...VALID_INPUT, schemaVersion: 0 })).toBeNull();
  });

  it("rejects missing schemaVersion", () => {
    const { schemaVersion: _drop, ...rest } = VALID_INPUT;
    expect(validateUpdateJson(rest)).toBeNull();
  });

  it("rejects schemaVersion as string '1'", () => {
    expect(validateUpdateJson({ ...VALID_INPUT, schemaVersion: "1" })).toBeNull();
  });
});

describe("validateUpdateJson — wrong types / missing fields", () => {
  it("rejects when version is a number", () => {
    expect(validateUpdateJson({ ...VALID_INPUT, version: 123 })).toBeNull();
  });

  it("rejects when version is empty string", () => {
    expect(validateUpdateJson({ ...VALID_INPUT, version: "" })).toBeNull();
  });

  it("rejects when platforms is missing", () => {
    const { platforms: _drop, ...rest } = VALID_INPUT;
    expect(validateUpdateJson(rest)).toBeNull();
  });

  it("rejects when platforms.mac is missing", () => {
    expect(
      validateUpdateJson({
        ...VALID_INPUT,
        platforms: { win: VALID_INPUT.platforms.win } as { win: string; mac: string },
      }),
    ).toBeNull();
  });

  it("rejects when highlights is not an array", () => {
    expect(
      validateUpdateJson({ ...VALID_INPUT, highlights: "not an array" }),
    ).toBeNull();
  });

  it("rejects when highlights contains non-string items", () => {
    expect(
      validateUpdateJson({ ...VALID_INPUT, highlights: ["ok", 42, "also ok"] }),
    ).toBeNull();
  });

  it("rejects empty object", () => {
    expect(validateUpdateJson({})).toBeNull();
  });

  it("rejects null", () => {
    expect(validateUpdateJson(null)).toBeNull();
  });

  it("rejects strings", () => {
    expect(validateUpdateJson("not json")).toBeNull();
  });
});

describe("applyUpdate — version display", () => {
  it("sets [data-sgh-version] text to v{version}", () => {
    const doc = document.implementation.createHTMLDocument();
    const span = doc.createElement("span");
    span.setAttribute("data-sgh-version", "");
    span.textContent = "v0.0.0";
    doc.body.appendChild(span);

    applyUpdate(VALID_INPUT, doc);

    expect(span.textContent).toBe("v0.2.0");
  });

  it("updates all elements carrying the attribute", () => {
    const doc = document.implementation.createHTMLDocument();
    for (let i = 0; i < 3; i++) {
      const el = doc.createElement("span");
      el.setAttribute("data-sgh-version", "");
      el.textContent = "fallback";
      doc.body.appendChild(el);
    }

    applyUpdate(VALID_INPUT, doc);

    doc.querySelectorAll("[data-sgh-version]").forEach((el) => {
      expect(el.textContent).toBe("v0.2.0");
    });
  });
});

describe("applyUpdate — highlights rendering", () => {
  it("renders <li> per highlight when non-empty", () => {
    const doc = document.implementation.createHTMLDocument();
    const ul = doc.createElement("ul");
    ul.setAttribute("data-sgh-highlights", "");
    doc.body.appendChild(ul);

    applyUpdate(VALID_INPUT, doc);

    const items = ul.querySelectorAll("li");
    expect(items.length).toBe(2);
    expect(items[0]?.textContent).toBe(
      "Custom title bar with built-in min/max/close buttons",
    );
    expect(items[1]?.textContent).toBe(
      "Single Mac download for Intel and Apple Silicon",
    );
  });

  it("renders maintenance-release copy when highlights is empty", () => {
    const doc = document.implementation.createHTMLDocument();
    const ul = doc.createElement("ul");
    ul.setAttribute("data-sgh-highlights", "");
    doc.body.appendChild(ul);

    applyUpdate({ ...VALID_INPUT, highlights: [] }, doc);

    expect(ul.querySelectorAll("li").length).toBe(0);
    expect(ul.textContent).toContain(
      "No new features in this release — bug fixes and stability improvements.",
    );
    expect(ul.textContent).toContain("full changelog");

    const link = ul.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe(VALID_INPUT.fullChangelog);
  });

  it("clears existing children before applying update", () => {
    const doc = document.implementation.createHTMLDocument();
    const ul = doc.createElement("ul");
    ul.setAttribute("data-sgh-highlights", "");
    const stale = doc.createElement("li");
    stale.textContent = "stale highlight from previous release";
    ul.appendChild(stale);
    doc.body.appendChild(ul);

    applyUpdate(VALID_INPUT, doc);

    const items = ul.querySelectorAll("li");
    expect(items.length).toBe(2);
    expect(ul.textContent).not.toContain("stale highlight");
  });
});
