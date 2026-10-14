---
name: Next app validator migration
description: A Next 15 build quirk in the Waraq workspace's Vite-to-Next migration.
---

In this mixed Vite-to-Next workspace, Next 15 generated `.next/types/validator.ts` with App Router imports under `src/app` even though the active routes are in the project-root `app` directory. Cleaning generated output and removing the Vite `src/pages` route did not correct those imports. Excluding only this generated validator allows production builds to pass while the strict TypeScript check still includes the actual app, components, models, APIs, and scripts. Do not broadly disable build type checking.

**Why:** Repeated clean builds failed on missing generated imports for files that exist under the root App Router; the targeted exclusion made the build succeed.

**How to apply:** If Next upgrades or the source layout changes, retry the build without the exclusion first. Keep it only if the generated validator still points at the wrong root, and retain strict `tsc` plus the production build as checks.
