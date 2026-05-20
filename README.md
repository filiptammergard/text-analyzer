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

## Usage

```js
import {
	countCharacters,
	countLines,
	countParagraphs,
	countSentences,
	countSequenceOccurrences,
	countWords,
	getAverageWordLength,
	getReadingTime,
	getWordFrequency,
} from "text-analyzer"
```

## API

### `countCharacters(text, options?)`

Count the number of characters in a text.

- `options.unit`: `"grapheme"` (default) counts user-perceived characters
  (e.g. the emoji `"👨‍👩‍👧"` counts as 1). `"code-unit"` counts UTF-16 code
  units, matching `String.prototype.length`.
- `options.locale`: BCP 47 locale tag passed to `Intl.Segmenter`. Only used
  when `unit` is `"grapheme"`.
- `options.normalize`: when `true`, normalize the text to NFC before counting.
  Defaults to `false`.

```js
countCharacters("text") // 4
countCharacters("👨‍👩‍👧") // 1
countCharacters("👨‍👩‍👧", { unit: "code-unit" }) // 8
```

### `countWords(text)`

Count the number of words in a text. Words are separated by any whitespace.
Note: punctuation stays attached, so `"hello, world"` counts as 2 words
(`"hello,"` and `"world"`). For a linguistic word count, use
`getWordFrequency`.

```js
countWords("one two three") // 3
countWords("  one\ttwo\r\nthree  ") // 3
```

### `countLines(text)`

Count the number of lines in a text. Handles `\n`, `\r\n`, and `\r`. A
trailing line terminator does not add an extra empty line.

```js
countLines("one\ntwo\nthree") // 3
countLines("one\n") // 1
```

### `countSentences(text, options?)`

Count the number of sentences using `Intl.Segmenter`, so decimals and
abbreviations don't accidentally split a sentence.

- `options.locale`: BCP 47 locale tag passed to `Intl.Segmenter`.

```js
countSentences("Hello. World!") // 2
countSentences("The value is 3.14. Done.") // 2
```

### `countParagraphs(text)`

Count the number of paragraphs. Paragraphs are separated by one or more
blank lines.

```js
countParagraphs("one\n\ntwo\n\n\nthree") // 3
```

### `countSequenceOccurrences(text, sequence, options?)`

Count the number of times a sequence occurs in a text.

- `options.caseSensitive`: defaults to `true`.
- `options.overlapping`: when `true`, overlapping matches are counted
  (e.g. `"aa"` matches 3 times in `"aaaa"`). Defaults to `false`.
- `options.locale`: BCP 47 locale tag used for case folding (only relevant
  when `caseSensitive` is `false`).
- `options.normalize`: when `true`, normalize both `text` and `sequence` to
  NFC before searching. Defaults to `false`.

```js
countSequenceOccurrences("dolor Dolor dolor", "dolor") // 2
countSequenceOccurrences("dolor Dolor dolor", "dolor", { caseSensitive: false }) // 3
countSequenceOccurrences("aaaa", "aa") // 2
countSequenceOccurrences("aaaa", "aa", { overlapping: true }) // 3
```

### `getWordFrequency(text, options?)`

Count how many times each word occurs in a text. Words are detected with
`Intl.Segmenter`, so punctuation is excluded and contractions are kept as one
word. Returns a `Map<string, number>` sorted by count in descending order.

- `options.caseSensitive`: defaults to `true`. Pass `false` for typical
  natural-language frequency analysis where `"The"` and `"the"` should be
  treated as the same word.
- `options.locale`: BCP 47 locale tag passed to `Intl.Segmenter` and used for
  case folding.

```js
getWordFrequency("The cat sat on the mat.")
// Map { "The" => 1, "cat" => 1, "sat" => 1, "on" => 1, "the" => 1, "mat" => 1 }

getWordFrequency("The cat sat on the mat.", { caseSensitive: false })
// Map { "the" => 2, "cat" => 1, "sat" => 1, "on" => 1, "mat" => 1 }
```

### `getAverageWordLength(text, options?)`

Compute the average length of words in a text. Returns `0` when the text
contains no words. Word splitting is whitespace-based, matching `countWords`.

- `options.unit`: passed to `countCharacters` (`"grapheme"` by default).
- `options.locale`: passed to `countCharacters`.

```js
getAverageWordLength("aa bbb cccc") // 3
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
