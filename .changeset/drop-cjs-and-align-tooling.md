---
"text-analyzer": major
---

Drop CommonJS support and align project tooling with other `@tammergard/*`
packages.

**Breaking**

- `text-analyzer` is now published as an ESM-only package. The CommonJS entry
  (`require("text-analyzer")`) is no longer available; consumers must use
  `import`.
- Published output now uses the `.mjs` and `.d.mts` extensions instead of
  `.js`/`.d.ts`. The `exports` field is unchanged from the consumer
  perspective — `import { ... } from "text-analyzer"` continues to work.
- `engines.node` is now `>=24` (was `>=18`).

**Internal**

- `package.json` keys sorted, deps moved to caret ranges, workflows switched
  to npm trusted publishing.
