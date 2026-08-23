# Browser Reading Tools Repair

## Findings

The live controls responded to visual interactions, but they did not preserve a student’s chosen reader settings across a refresh. The service worker also ran in local development, which could mask a current local build behind cached navigation output.

## Repair

The reading space now stores validated preferences for text size, line spacing, contrast, and focus in `localStorage`. It restores those values when the page opens. The service worker no longer runs on `localhost`, receives a new cache version, and treats page navigation as network-first so new Vercel releases are fetched before the offline fallback is used.

## Verification

The regression suite confirms malformed stored values resolve safely, valid values are preserved, and each supported visual setting maps to a visible change. In browser verification, selecting **Extra large** stored the preference, survived a refresh, restored `aria-pressed="true"`, and applied a 24px reading-text size.

The deployed Vercel reader was also verified after the repair. A refreshed `/learn?refresh=1` session served the new status feedback and the working reading controls, confirming the current build is available online.

## Full interactive regression coverage

The browser interaction script runs at a 1280×720 desktop viewport and a 390×844 phone-sized viewport. In both, it verifies extra-large text increases the rendered size, relaxed spacing increases line height, high contrast changes the reader surface, focus mode adds its reading frame, read-aloud exposes a pause control and changes to a paused status, and all reader preferences persist through a reload. The script uses a deterministic browser speech mock for the pause/resume assertions because headless Chromium does not provide a normal operating-system voice service.
