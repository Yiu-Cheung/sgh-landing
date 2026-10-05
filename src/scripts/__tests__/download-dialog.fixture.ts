// Shared jsdom fixture for the download-dialog tests. Not a test file: the
// vitest include pattern is src/**/__tests__/**/*.test.ts.
//
// The markup mirrors the data contract of design D3/D4 in openspec change
// add-download-install-dialog. jsdom lacks HTMLDialogElement showModal/close,
// so buildFixture stubs them on the prototype (saveProto/restoreProto undo it).

export const WIN_URL = "https://dl.smartgalleryhub.com/latest/SGH-Setup.exe";
export const ARM_URL = "https://dl.smartgalleryhub.com/latest/SGH-arm64.dmg";
export const X64_URL = "https://dl.smartgalleryhub.com/latest/SGH-x64.dmg";

export interface Fixture {
  win: HTMLAnchorElement;
  arm: HTMLAnchorElement;
  x64: HTMLAnchorElement;
  dialog: HTMLDialogElement;
  winPanel: HTMLElement;
  macPanel: HTMLElement;
  primary: HTMLButtonElement;
  cancel: HTMLButtonElement;
  closeButtons: HTMLButtonElement[];
}

export const dialogProto = HTMLDialogElement.prototype as unknown as Record<string, unknown>;
const originals: Record<string, PropertyDescriptor | undefined> = {};

export function saveProto(): void {
  for (const k of ["showModal", "close"]) {
    originals[k] = Object.getOwnPropertyDescriptor(dialogProto, k);
  }
}

export function restoreProto(): void {
  for (const k of ["showModal", "close"]) {
    const d = originals[k];
    if (d) Object.defineProperty(dialogProto, k, d);
    else delete dialogProto[k];
  }
}

export function buildFixture(opts: { stubDialog: boolean }): Fixture {
  document.body.innerHTML = `
    <a id="win" href="${WIN_URL}" data-dl-platform="win">Windows</a>
    <a id="arm" href="${ARM_URL}" data-dl-platform="mac">Apple Silicon</a>
    <a id="x64" href="${X64_URL}" data-dl-platform="mac">Intel</a>
    <dialog id="dl-dialog">
      <div class="inner">
        <section data-dl-panel="win">
          <h2 id="dl-h-win">Install on Windows</h2>
          <button type="button" data-dl-close aria-label="Close">×</button>
          <p id="win-text">win steps</p>
        </section>
        <section data-dl-panel="mac" hidden>
          <h2 id="dl-h-mac">Install on Mac</h2>
          <button type="button" data-dl-close aria-label="Close">×</button>
          <p id="mac-text">mac steps</p>
        </section>
        <footer>
          <button type="button" id="cancel" data-dl-close>Cancel</button>
          <button type="button" data-dl-primary>placeholder</button>
        </footer>
      </div>
    </dialog>`;
  if (opts.stubDialog) {
    Object.defineProperty(dialogProto, "showModal", {
      configurable: true,
      writable: true,
      value(this: HTMLDialogElement): void {
        this.setAttribute("open", "");
      },
    });
    Object.defineProperty(dialogProto, "close", {
      configurable: true,
      writable: true,
      value(this: HTMLDialogElement): void {
        if (!this.hasAttribute("open")) return;
        this.removeAttribute("open");
        this.dispatchEvent(new Event("close")); // synchronous on purpose
      },
    });
  } else {
    Object.defineProperty(dialogProto, "showModal", { configurable: true, writable: true, value: undefined });
  }
  const q = <T extends Element>(s: string): T => document.querySelector(s) as T;
  return {
    win: q("#win"),
    arm: q("#arm"),
    x64: q("#x64"),
    dialog: q("#dl-dialog"),
    winPanel: q('[data-dl-panel="win"]'),
    macPanel: q('[data-dl-panel="mac"]'),
    primary: q("[data-dl-primary]"),
    cancel: q("#cancel"),
    closeButtons: Array.from(document.querySelectorAll<HTMLButtonElement>("button[data-dl-close][aria-label]")),
  };
}

export function click(el: Element, init: MouseEventInit = {}): MouseEvent {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init });
  el.dispatchEvent(ev);
  return ev;
}

export function pointerDown(el: Element): void {
  el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
}
