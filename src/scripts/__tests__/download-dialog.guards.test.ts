// @vitest-environment jsdom
//
// No-intercept guards and state resets of src/scripts/download-dialog.ts.
// Spec scenarios from openspec/changes/add-download-install-dialog (landing-site delta):
//   - Cards still download when scripts do not run (no-intercept fallbacks):
//     missing primary button, no card, empty href, no panel for the platform,
//     showModal() throwing
//   - Dismissing the dialog does not download (backdrop flag reset on close)
//   - Each card opens its panel scrolled to the top
import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import { initDownloadDialog } from "../download-dialog";
import {
  buildFixture,
  click,
  dialogProto,
  pointerDown,
  restoreProto,
  saveProto,
  type Fixture,
} from "./download-dialog.fixture";

describe("download-dialog guards", () => {
  let navigate: Mock<(url: string) => void>;
  let f: Fixture;

  beforeEach(() => {
    saveProto();
    navigate = vi.fn<(url: string) => void>();
    f = buildFixture({ stubDialog: true });
  });

  afterEach(() => {
    restoreProto();
    document.body.innerHTML = "";
  });

  function init(): boolean {
    return initDownloadDialog(document, navigate);
  }

  describe("installs nothing", () => {
    it("returns false and wires nothing when the primary button is missing", () => {
      f.primary.remove();
      expect(init()).toBe(false);
      expect(click(f.win).defaultPrevented).toBe(false);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      // Close buttons are not wired either.
      f.dialog.showModal();
      click(f.cancel);
      expect(f.dialog.hasAttribute("open")).toBe(true);
    });

    it("returns false and wires nothing when there is no card", () => {
      for (const card of [f.win, f.arm, f.x64]) card.remove();
      expect(init()).toBe(false);
      expect(f.primary.textContent).toBe("placeholder");
      // The primary button is not wired: no close, no navigate.
      f.dialog.showModal();
      click(f.primary);
      expect(f.dialog.hasAttribute("open")).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe("per-click no-intercept", () => {
    it.each([[""], ["   "]] as const)("does not intercept a card whose href attribute is %j", (raw) => {
      f.win.setAttribute("href", raw);
      // The resolved property is the page URL, which is why the guard reads the attribute.
      expect(f.win.href).not.toBe("");
      expect(init()).toBe(true);
      expect(click(f.win).defaultPrevented).toBe(false);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      click(f.primary);
      expect(navigate).not.toHaveBeenCalled();
      // The other cards are unaffected.
      expect(click(f.arm).defaultPrevented).toBe(true);
    });

    it("does not intercept a card whose data-dl-platform has no matching panel", () => {
      f.win.dataset.dlPlatform = "linux";
      expect(init()).toBe(true);
      expect(click(f.win).defaultPrevented).toBe(false);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      expect(f.winPanel.hidden).toBe(false);
      expect(f.macPanel.hidden).toBe(true);
    });

    it("leaves the click native when showModal() throws, with no pending download", () => {
      expect(init()).toBe(true);
      Object.defineProperty(dialogProto, "showModal", {
        configurable: true,
        writable: true,
        value(): void {
          throw new DOMException("dialog is already open", "InvalidStateError");
        },
      });
      const ev = click(f.win);
      expect(ev.defaultPrevented).toBe(false);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      click(f.primary);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe("state resets", () => {
    it("opens a previously scrolled panel at the top", () => {
      expect(init()).toBe(true);
      click(f.win);
      f.winPanel.scrollTop = 120;
      expect(f.winPanel.scrollTop).toBe(120); // jsdom keeps the offset
      click(f.cancel);
      click(f.win);
      expect(f.winPanel.scrollTop).toBe(0);
    });

    it.each([
      [
        "Cancel",
        (fx: Fixture): void => {
          click(fx.cancel);
        },
      ],
      ["native close (Esc path)", (fx: Fixture): void => fx.dialog.close()],
    ] as const)("close via %s clears the backdrop pointerdown flag", (_name, closeIt) => {
      expect(init()).toBe(true);
      click(f.win);
      pointerDown(f.dialog);
      closeIt(f);
      expect(f.dialog.hasAttribute("open")).toBe(false);
      click(f.win);
      // A lone click on the dialog (no pointerdown since reopening) must not close.
      click(f.dialog);
      expect(f.dialog.hasAttribute("open")).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
