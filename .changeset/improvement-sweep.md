---
"text-analyzer": major
---

Breaking changes and improvements:

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
- Bump dev dependencies: ESLint 10, TypeScript 6, eslint-config-base 5.1.
- Add `exports`, `sideEffects: false`, and `engines.node >= 18` to
  `package.json`.
- Add JSDoc documentation to all exported functions.
