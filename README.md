# text-analyzer

Utility functions providing possibilities to analyze text.

## Installation

```bash
# npm
npm install text-analyzer

# yarn
yarn add text-analyzer

# pnpm
pnpm add text-analyzer
```

## API

### `countCharacters(text, options?)`

Count the number of characters in a text.

- `options.unit`: `"grapheme"` (default) counts user-perceived characters
  (e.g. the emoji `"👨‍👩‍👧"` counts as 1). `"code-unit"` counts UTF-16 code
  units, matching `String.prototype.length`.

```js
countCharacters("text") // 4
countCharacters("👨‍👩‍👧") // 1
countCharacters("👨‍👩‍👧", { unit: "code-unit" }) // 8
```

### `countWords(text)`

Count the number of words in a text. Words are separated by any whitespace.

```js
countWords("one two three") // 3
countWords("  one\ttwo\r\nthree  ") // 3
```

### `countSequenceOccurrences(text, sequence, options?)`

Count the number of times a sequence occurs in a text.

- `options.caseSensitive`: defaults to `true`.
- `options.overlapping`: when `true`, overlapping matches are counted
  (e.g. `"aa"` matches 3 times in `"aaaa"`). Defaults to `false`.

```js
countSequenceOccurrences("dolor Dolor dolor", "dolor") // 2
countSequenceOccurrences("dolor Dolor dolor", "dolor", { caseSensitive: false }) // 3
countSequenceOccurrences("aaaa", "aa") // 2
countSequenceOccurrences("aaaa", "aa", { overlapping: true }) // 3
```

### `getReadingTime(text, options?)`

Estimate the reading time for a text.

- `options.wordsPerMinute`: reading speed. Must be greater than `0`. Defaults
  to `200`.

```js
getReadingTime("one two three")
// { words: 3, minutes: 0.015, milliseconds: 900 }

getReadingTime("one two three", { wordsPerMinute: 100 })
// { words: 3, minutes: 0.03, milliseconds: 1800 }
```

## License

MIT
