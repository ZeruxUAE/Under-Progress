# Under Progress presentation alignment notes

## Attached PDF findings captured so far

From the reviewed PDF pages, the current presentation already includes several important narrative elements that must be preserved in the revised deck.

### Cover framing

- Under Progress is positioned under the **Inclusive Digital Accessibility & Empowered Communities** theme.
- The product is described as a **consent-first student accessibility companion**.
- The challenge focus is explicitly **Student Accessibility Services**.
- The top-level journey is presented as: **student chooses needs → personalised learning support → accessible web continuity**.
- The cover explicitly says the product is **not a diagnostic tool** and instead helps students describe supports, practise in an accessible environment, and reach human support with informed consent.

### Problem framing

- The problem slide argues that the barrier is often the default system rather than the person.
- It highlights three defaults that create exclusion: one fixed reading surface, one fixed way to navigate, and one fixed label for people.
- The quote to preserve is: **“The web should adapt to people—not force people to adapt to the web.”**

### Why it matters

- The impact framing is that digital access is a condition for participation in education, work, and services.
- The evidence line already uses the safer statistic: in a World Bank/GPE analysis of 19 developing countries, **6 in 10** children with disabilities could read and write.
- The deck already distinguishes this from a universal literacy rate and from education exclusion.

### Solution framing

- The solution is framed as **one platform, two places of support**.
- The website is the main learning/support workspace.
- The extension is the continuity layer that carries selected accessibility settings into ordinary webpages.
- The slide already says clearly that the extension is **not the product by itself**.

### Inclusive access framing

- The deck already states that access should not depend on reading alone.
- It includes voice-first guidance, icon-led short-step choices, and human support by choice.
- It explicitly states: **Illiteracy is not a disability. Our role is to remove unnecessary text barriers—not to diagnose anyone.**

## Required alignment checks for next steps

- Compare the website’s current language/extension behavior messaging against the deck and add anything missing.
- Review the remaining PDF pages and the current slide project to identify missing multilingual, extension-language-sync, and privacy wording.
- Confirm whether the deck already includes Arabic/English support, browser-language hinting, extension Read Aloud language control, and fallback-voice explanation.

## Additional PDF findings from later pages

The later PDF pages add several details that should be carried into the final revised deck if they are not already present in the live slides.

### Student support journey

The journey slide is more explicit than the website in one important area: it shows a five-step path of **choose needs**, **choose language**, **check in**, **reach support**, and **continue anywhere**. It also states clearly that a student does not need to diagnose themselves, and that any referral, data sharing, or institutional follow-up must remain visible to the student and require meaningful consent.

### Personalization without labeling

The personalization slide argues that a person can choose many needs, one need, or only tools that help. It lists examples including dyslexia, ADHD, autism, low vision, mobility, and a general “prefer to choose tools” path. The key line to preserve is that the profile should support agency and should not define identity. It also says the profile starts a conversation and that the user keeps the control.

### Extension capabilities

The extension slide focuses on concrete controls: text scale, line spacing, reading width, contrast plus focus, and named presets. It also explains the download/connect flow: the extension is distributed by GitHub release, then loaded and connected from the setup experience.

### Ethical boundary

The ethical AI and privacy slide reinforces four principles: student control, minimal meaningful data, explainable support signals, and human referral with consent. These need to remain aligned with the website language so that the deck never sounds diagnostic or institution-first.

### Language access

The language-access slide already includes important framing: the browser language is only a hint, the student chooses another language if needed, the choice carries to read-aloud, privacy design avoids IP geolocation, and the technical boundary is that speech depends on voices available on the student’s device or browser. This last point is especially relevant now because the extension issue reported by the user shows that the presentation must explain both the intended behavior and the honest fallback limit.

## What the revised deck still needs after these findings

The revised deck should explicitly reflect the latest product state from the website and extension repositories:

- The language popup now states in bold that the choice controls **Read Aloud** in the Chrome and Edge extension.
- The extension now stores a dedicated speech-language preference and should use that instead of only the browser default.
- The deck should describe fallback behavior carefully: if no matching voice exists on the device, the extension uses the closest available browser voice rather than claiming full speech coverage where the platform does not provide it.

## Final PDF findings

The final pages add a trust model and a clear MVP demonstration plan. Trust is framed as part of accessibility: profiles stay in browser-local storage, every control is reversible, the website-to-extension connection needs a visible action, and browser language is a hint rather than an identity label. The presentation should retain the central line **“No hidden mode.”**

The final hackathon MVP asks the team to demonstrate three things: a personalised support flow from multiple self-selected needs to saved settings, continuity beyond the platform through the extension on a normal webpage, and a consent-based route from a student check-in to a human Student Accessibility Services request. The chosen challenge remains **Student Accessibility Services**.
