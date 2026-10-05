// @vitest-environment jsdom
//
// Spec scenarios from openspec/changes/add-download-install-dialog (landing-site delta):
//   - cards open the matching install panel; primary button downloads; every dismissal is a no-op
//   - without dialog support / on non-plain clicks the links behave natively
import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import { fileNameFromHref, initDownloadDialog } from "../download-dialog";
import {
  ARM_URL,
  WIN_URL,
  X64_URL,
  buildFixture,
  click,
  pointerDown,
  restoreProto,
  saveProto,
  type Fixture,
} from "./download-dialog.fixture";

describe("download-dialog", () => {
  let navigate: Mock<(url: string) => void>;
  let f: Fixture;

  beforeEach(() => {
    saveProto();
    navigate = vi.fn<(url: string) => void>();
  });

  afterEach(() => {
    restoreProto();
    document.body.innerHTML = "";
  });

  function setup(): void {
    f = buildFixture({ stubDialog: true });
    expect(initDownloadDialog(document, navigate)).toBe(true);
  }

  // 1.4
  describe("fileNameFromHref", () => {
    it("returns the last path segment", () => {
      expect(fileNameFromHref(WIN_URL)).toBe("SGH-Setup.exe");
      expect(fileNameFromHref(ARM_URL)).toBe("SGH-arm64.dmg");
    });
    it("ignores query string and hash", () => {
      expect(fileNameFromHref("https://x.test/latest/SGH-x64.dmg?a=1#top")).toBe("SGH-x64.dmg");
      expect(fileNameFromHref("https://x.test/latest/SGH-x64.dmg#frag")).toBe("SGH-x64.dmg");
    });
  });

  // 1.3
  describe("open per platform", () => {
    it("Windows card: prevents default, opens, shows win panel, labels by win heading", () => {
      setup();
      const ev = click(f.win);
      expect(ev.defaultPrevented).toBe(true);
      expect(f.dialog.hasAttribute("open")).toBe(true);
      expect(f.winPanel.hidden).toBe(false);
      expect(f.macPanel.hidden).toBe(true);
      expect(f.dialog.getAttribute("aria-labelledby")).toBe("dl-h-win");
    });
    it.each([["arm"], ["x64"]] as const)("%s card shows the mac panel", (key) => {
      setup();
      const ev = click(f[key]);
      expect(ev.defaultPrevented).toBe(true);
      expect(f.dialog.hasAttribute("open")).toBe(true);
      expect(f.macPanel.hidden).toBe(false);
      expect(f.winPanel.hidden).toBe(true);
      expect(f.dialog.getAttribute("aria-labelledby")).toBe("dl-h-mac");
    });
  });

  // 1.4
  describe("primary label", () => {
    it.each([
      ["win", "SGH-Setup.exe"],
      ["arm", "SGH-arm64.dmg"],
      ["x64", "SGH-x64.dmg"],
    ] as const)("%s card label names the file", (key, name) => {
      setup();
      click(f[key]);
      expect(f.primary.textContent).toBe(`I understand — download ${name}`);
    });
  });

  // 1.5
  describe("download", () => {
    it("primary navigates once to the clicked href and closes (href captured before close)", () => {
      setup();
      click(f.arm);
      click(f.primary);
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(ARM_URL);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      // State is cleared by the download: a second primary click goes nowhere.
      click(f.primary);
      expect(navigate).toHaveBeenCalledTimes(1);
    });
  });

  // 1.6
  describe("dismissal never downloads", () => {
    it("Cancel closes", () => {
      setup();
      click(f.win);
      click(f.cancel);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    });
    it("both x buttons close", () => {
      setup();
      expect(f.closeButtons).toHaveLength(2);
      for (const b of f.closeButtons) {
        click(f.win);
        click(b);
        expect(f.dialog.hasAttribute("open")).toBe(false);
      }
      expect(navigate).not.toHaveBeenCalled();
    });
    it("backdrop pointerdown + click on the dialog element closes", () => {
      setup();
      click(f.win);
      pointerDown(f.dialog);
      click(f.dialog);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    });
    it("click inside the panel does not close", () => {
      setup();
      click(f.win);
      const text = document.querySelector("#win-text") as Element;
      pointerDown(text);
      click(text);
      expect(f.dialog.hasAttribute("open")).toBe(true);
    });
    it("pointerdown inside the panel then click on the dialog (drag-select) does not close", () => {
      setup();
      click(f.win);
      pointerDown(document.querySelector("#win-text") as Element);
      click(f.dialog);
      expect(f.dialog.hasAttribute("open")).toBe(true);
    });
    it("cancel event and Escape keydown never navigate", () => {
      // Documented no-op guard: the script has no cancel/keydown handler; real Esc closing is proven in the browser smoke (task 4.4).
      setup();
      click(f.win);
      f.dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
      f.dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      f.dialog.close();
      expect(navigate).not.toHaveBeenCalled();
    });
    it("stale state: Windows -> Cancel -> Intel -> primary navigates only to x64", () => {
      setup();
      click(f.win);
      click(f.cancel);
      click(f.x64);
      click(f.primary);
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(X64_URL);
    });
    it("primary with no pending card (after close) does not navigate", () => {
      setup();
      click(f.win);
      click(f.cancel);
      click(f.primary);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  // 1.7
  describe("fallbacks", () => {
    it("leaves every card href unchanged", () => {
      setup();
      expect(f.win.getAttribute("href")).toBe(WIN_URL);
      expect(f.arm.getAttribute("href")).toBe(ARM_URL);
      expect(f.x64.getAttribute("href")).toBe(X64_URL);
    });
    it("returns false and intercepts nothing when showModal is not a function", () => {
      f = buildFixture({ stubDialog: false });
      expect(typeof (f.dialog as unknown as { showModal?: unknown }).showModal).not.toBe("function");
      expect(initDownloadDialog(document, navigate)).toBe(false);
      expect(click(f.win).defaultPrevented).toBe(false);
      expect(f.dialog.hasAttribute("open")).toBe(false);
    });
    it("returns false and intercepts nothing when the dialog element is missing", () => {
      f = buildFixture({ stubDialog: true });
      f.dialog.remove();
      expect(initDownloadDialog(document, navigate)).toBe(false);
      expect(click(f.win).defaultPrevented).toBe(false);
    });
    it.each([
      ["ctrlKey", { ctrlKey: true }],
      ["metaKey", { metaKey: true }],
      ["shiftKey", { shiftKey: true }],
      ["altKey", { altKey: true }],
      ["button 1", { button: 1 }],
    ] as const)("does not intercept a %s click", (_n, init) => {
      setup();
      const ev = click(f.win, init);
      expect(ev.defaultPrevented).toBe(false);
      expect(f.dialog.hasAttribute("open")).toBe(false);
    });
    it("does not intercept a click already defaultPrevented", () => {
      setup();
      f.win.addEventListener("click", (e) => e.preventDefault(), { capture: true });
      click(f.win);
      expect(f.dialog.hasAttribute("open")).toBe(false);
    });
    it("both x buttons carry aria-label=Close", () => {
      setup();
      expect(f.closeButtons.every((b) => b.getAttribute("aria-label") === "Close")).toBe(true);
    });
  });
});
