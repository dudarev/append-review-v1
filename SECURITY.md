# Security Policy

This is a local-first app: all user data is stored in the browser (localStorage) and no server-side persistence exists. Security issues will typically relate to client-side code (XSS, unsafe URL handling, etc.).

## Supported versions
We generally support the latest release published in this repository.

## Reporting a vulnerability

Please use GitHub’s private vulnerability reporting if enabled for this repo, or open a private security advisory:

- https://github.com/dudarev/append-review-v1/security/advisories/new

If that is not available, you may open an issue with minimal details and request a maintainer reach out privately.

## Out of scope
- Loss of data due to clearing browser storage, private/incognito mode, or device policies
- Local device compromise (e.g., other apps reading your browser storage)

## Notes
- No database or external API keys are used by the app. Build-time configuration is handled via Vite env vars for static deployment base paths.

