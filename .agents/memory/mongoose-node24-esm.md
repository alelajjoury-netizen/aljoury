---
name: Mongoose on Node 24
description: ESM import compatibility between Mongoose and Node 24 in the Waraq workspace.
---

With this workspace running Node 24 in ESM mode, importing Mongoose members as named exports (for example, `models`) failed at runtime in the seed script even though TypeScript accepted it. A default `mongoose` import and access through `mongoose.models`, `mongoose.model`, and `mongoose.Schema` worked.

**Why:** The runtime treated Mongoose as CommonJS and did not expose the expected synthetic named export.

**How to apply:** For Mongoose model modules and standalone scripts here, prefer the default import; verify with both strict typecheck and the actual script runtime.
