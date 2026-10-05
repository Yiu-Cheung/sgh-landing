// Pre-download install dialog for /download. Consumed by:
//   - src/components/DownloadInstallDialog.astro (bundled module <script>, runs
//     after the document is parsed)
//
// Progressive enhancement: the three download cards stay plain <a href> links
// to their evergreen latest/ URLs. This module installs nothing unless the
// dialog exists, supports showModal() and has a primary button, and at least
// one card exists. Even then it only intercepts a plain primary click on a card
// with a non-empty href and a matching panel, and only once showModal() has
// succeeded. Every other click downloads directly.
//
// Data contract (design D3/D4 of openspec change add-download-install-dialog):
//   - card:   <a href=".../latest/<file>" data-dl-platform="win|mac">
//   - dialog: <dialog id="dl-dialog"> holding one [data-dl-panel="win|mac"] per
//             platform (each with an id'd heading), [data-dl-close] buttons
//             (x and Cancel) and one [data-dl-primary] button.
// The prefix is data-dl-*, NOT data-sgh-*: the update.json runtime handler
// must never select (and rewrite) the download CTAs.
//
// Spec scenarios this module enforces (landing-site delta):
//   - Windows card opens the Windows panel
//   - Each Mac card opens the Mac panel with its own filename
//   - Primary button downloads the clicked card's file
//   - Dismissing the dialog does not download
//   - Cards still download when scripts do not run (no-intercept fallbacks)

const DIALOG_ID = "dl-dialog";
const PRIMARY_LABEL_PREFIX = "I understand — download ";
const HEADING_SELECTOR = "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]";

/**
 * Last path segment of a URL or path, ignoring any query string or hash:
 * "https://dl.example/latest/SGH-x64.dmg?a=1#top" -> "SGH-x64.dmg".
 *
 * The primary button's filename comes from the card's own href, so the label
 * and the download URL cannot drift apart.
 */
export function fileNameFromHref(href: string): string {
  const path = href.split(/[?#]/, 1)[0] ?? "";
  return path.slice(path.lastIndexOf("/") + 1);
}

/**
 * True only for an unmodified primary-button click nothing else has handled.
 * Ctrl/Cmd/Shift/Alt-clicks keep native link behaviour (new tab, save as...).
 * Middle-click fires `auxclick`, not `click`, so it never reaches here.
 */
function isPlainPrimaryClick(event: MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * Wires the download cards to the install dialog.
 *
 * Returns whether interception was installed. Returns false (and touches
 * nothing) when the dialog or its primary button is missing, when there is no
 * card at all, or when `showModal` is not a function — the cards then
 * download natively.
 *
 * `navigate` defaults to a real page navigation; tests inject a spy because
 * jsdom does not implement navigation.
 *
 * Every dismissal (Cancel, x, backdrop, Esc) ends in the dialog's `close`
 * event, which clears the pending href. The only path to `navigate` is the
 * primary button, using the href of the most recently clicked card.
 */
export function initDownloadDialog(
  doc: Document,
  navigate: (url: string) => void = (url: string): void => window.location.assign(url),
): boolean {
  const dialog = doc.getElementById(DIALOG_ID) as HTMLDialogElement | null;
  if (!dialog || typeof dialog.showModal !== "function") return false;
  const primary = dialog.querySelector<HTMLButtonElement>("[data-dl-primary]");
  const cards = Array.from(doc.querySelectorAll<HTMLAnchorElement>("a[data-dl-platform]"));
  if (!primary || cards.length === 0) return false;
  const panels = Array.from(dialog.querySelectorAll<HTMLElement>("[data-dl-panel]"));

  let pendingHref = "";
  let pointerDownOnDialog = false;

  // Returns whether the dialog opened. If showModal() throws (e.g.
  // InvalidStateError) the script state is cleared and false is returned, so
  // the caller leaves the click alone. Panels, label and aria-labelledby are
  // rewritten on every open, so they need no rollback.
  const openFor = (href: string, panel: HTMLElement): boolean => {
    // Before showModal(): it moves focus into the visible panel.
    // Set BOTH panels every time; never rely on the initial hidden state.
    for (const p of panels) p.hidden = p !== panel;
    const heading = panel.querySelector<HTMLElement>(HEADING_SELECTOR);
    if (heading) dialog.setAttribute("aria-labelledby", heading.id);
    else dialog.removeAttribute("aria-labelledby");
    primary.textContent = PRIMARY_LABEL_PREFIX + fileNameFromHref(href);
    try {
      dialog.showModal();
    } catch {
      pendingHref = "";
      pointerDownOnDialog = false;
      return false;
    }
    pendingHref = href;
    // After showModal(): a scroll offset only sticks on a rendered element.
    panel.scrollTop = 0;
    return true;
  };

  for (const card of cards) {
    card.addEventListener("click", (event: MouseEvent): void => {
      if (!isPlainPrimaryClick(event)) return;
      // The raw attribute, not card.href: href="" resolves to the page URL.
      const raw = card.getAttribute("href") ?? "";
      const panel = panels.find((p) => p.dataset.dlPanel === card.dataset.dlPlatform);
      // No href or no panel for this platform: let the link download natively.
      if (!raw.trim() || !panel) return;
      // preventDefault() only once the dialog is open. Both run synchronously
      // inside this handler, so native navigation is still blocked; if the
      // open fails the event is untouched and the link downloads natively.
      if (openFor(card.href, panel)) event.preventDefault();
    });
  }

  for (const btn of Array.from(dialog.querySelectorAll<HTMLElement>("[data-dl-close]"))) {
    btn.addEventListener("click", (): void => dialog.close());
  }

  primary.addEventListener("click", (): void => {
    // Read BEFORE close(): the close listener clears pendingHref, and `close`
    // can fire synchronously.
    const href = pendingHref;
    dialog.close();
    if (href) navigate(href);
  });

  // Backdrop: with zero dialog padding and all content in an inner wrapper,
  // only a backdrop hit has the <dialog> itself as target. Require BOTH the
  // pointerdown and the click to land there, so a text-selection drag that
  // starts inside the panel and ends on the backdrop does not close it.
  dialog.addEventListener("pointerdown", (event: Event): void => {
    pointerDownOnDialog = event.target === dialog;
  });
  dialog.addEventListener("click", (event: MouseEvent): void => {
    const fromBackdrop = pointerDownOnDialog && event.target === dialog;
    pointerDownOnDialog = false;
    if (fromBackdrop) dialog.close();
  });

  // Esc is handled natively (cancel -> close); nothing to add for it here.
  dialog.addEventListener("close", (): void => {
    pendingHref = "";
    pointerDownOnDialog = false;
  });

  return true;
}
