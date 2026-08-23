# Extension lifecycle verification — v0.5.5

The public stable extension package at `releases/latest/download/under-progress-extension.zip` was downloaded and inspected on 23 August 2026. Its manifest reports version `0.5.5`.

The package was loaded into a clean Chromium profile and opened against the live Vercel setup route, `https://under-progress-psi.vercel.app/setup`. The extension connected to the live setup page. The test then invoked `chrome.runtime.reload()` while the page remained open and sent a new bridge request.

The setup page did not remain on **“Checking for the Under Progress extension…”**. It recovered by showing either a fresh connection result or the explicit instruction: **“The extension was updated or reloaded. Reload this webpage, then connect again.”** The automated live reload check completed successfully.

This behavior is intentional: Chrome content scripts from the old extension instance cannot safely use extension APIs after an update or reload. Under Progress now detects that state, avoids the `Extension context invalidated` crash, and gives the student a clear, recoverable next step.
