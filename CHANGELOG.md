# text-analyzer

## 3.0.1

### Patch Changes

- 7b544e6: Use `devEngines` instead of `engines` for the Node version requirement, so it applies to development only and no longer constrains consumers of the package.

## 3.0.0

### Major Changes

- 884408a: Drop CommonJS support and align project tooling with other `@tammergard/*`
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

## 2.0.0

### Major Changes

- 6ab4a53: Breaking changes and improvements:
  - Rename `countSequenceOccurances` to `countSequenceOccurrences` (typo fix).
  - Replace `caseSensitivity: "sensitive" | "insensitive"` with `caseSensitive:
boolean`. The default is now case-sensitive (`true`).
  - Add `overlapping` option to `countSequenceOccurrences` (default `false`).
  - `countSequenceOccurrences` now returns `0` for an empty `sequence` instead
    of `text.length - 1`.
  - `countCharacters` now counts user-perceived characters (grapheme clusters)
    by default, so emoji like `"👨‍👩‍👧"` count as `1`. Pass
    `{ unit: "code-unit" }` to restore the previous UTF-16 behavior.
  - `countWords` now treats all Unicode whitespace as a separator (including
    NBSP, CRLF as a unit, form feed, vertical tab).
  - `getReadingTime` throws `RangeError` when `wordsPerMinute <= 0`.
  - Add `locale` and `normalize` options to `countCharacters` and
    `countSequenceOccurrences` for locale-aware segmentation/case folding and
    optional Unicode NFC normalization.
  - Add new functions: `countLines`, `countSentences`, `countParagraphs`,
    `getWordFrequency`, `getAverageWordLength`.
  - Bump dev dependencies: ESLint 10, TypeScript 6, eslint-config-base 5.1.
  - Swap `tsup` for `tsdown` as the build tool. Built artifacts are now
    `dist/index.cjs` and `dist/index.d.cts` (instead of `.js` / `.d.ts`).
  - Add `exports`, `sideEffects: false`, and `engines.node >= 18` to
    `package.json`.
  - Add JSDoc documentation to all exported functions.

## 1.6.1

### Patch Changes

- dbc9a60: Publish with provenance.
