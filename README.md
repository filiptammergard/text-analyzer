# text-analyzer

Utility functions providing possibilities to analyze text.

## Installation

Install this package:

```bash
# npm
npm install text-analyzer

# yarn
yarn add text-analyzer
```

## Usage

```js
import {
  countCharacters,
  countWords,
  countSequences,
  getReadingTime,
} from "text-analyzer";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const characters = countCharacters(text);
// characters = 445

const words = countWords(text);
// words = 69

const sequences = countSequences(text, "dolor");
// sequences = 4

const readingTime = getReadingTime(text);
/*
  readingTime = {
    milliseconds: 20700
    minutes: 0.345
    words: 69
  }
*/
```

Average reading speed is set to 200 words per minute.

## Licence

MIT
