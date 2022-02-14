import { assert, describe, it } from "vitest"
import {
  countCharacters,
  countSequenceOccurances,
  countWords,
  getReadingTime,
} from "./index"

describe("countCharacters", () => {
  it("handles empty string", () => {
    assert.equal(countCharacters(""), 0)
  })
  it("handles non-empty string", () => {
    assert.equal(countCharacters("text"), 4)
  })
  it("handles white space", () => {
    assert.equal(countCharacters("\n \t"), 3)
  })
})

describe("countWords", () => {
  it("handles empty string", () => {
    assert.equal(countWords(""), 0)
  })
  it("handles non-empty string", () => {
    assert.equal(countWords("text text text"), 3)
  })
  it("handles white space", () => {
    assert.equal(countWords("\n \t"), 0)
  })
  it("handles leading and trailing white space", () => {
    assert.equal(countWords(" text  \n"), 1)
  })
})

describe("countSequenceOccurances", () => {
  it("handles empty string", () => {
    assert.equal(countSequenceOccurances("", "text"), 0)
  })
  it("handles non-empty string", () => {
    assert.equal(countSequenceOccurances("text text characters", "text"), 2)
  })
  it("handles case insensitive counting", () => {
    assert.equal(countSequenceOccurances("Text teXt", "teXt"), 2)
  })
  it("handles case sensitive counting", () => {
    assert.equal(
      countSequenceOccurances("Text teXt", "teXt", {
        caseSensitivity: "sensitive",
      }),
      1,
    )
  })
})

describe("getReadingTime", () => {
  const text =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente ut nulla earum inventore possimus quas ab, omnis beatae architecto quisquam!"
  it("handles empty string", () => {
    assert.equal(getReadingTime("").words, 0)
    assert.equal(getReadingTime("").minutes, 0)
    assert.equal(getReadingTime("").milliseconds, 0)
  })
  it("handles non-empty string", () => {
    assert.equal(getReadingTime(text).words, 20)
    assert.equal(getReadingTime(text).minutes, 0.1)
    assert.equal(getReadingTime(text).milliseconds, 6000)
  })
  it("handles white space", () => {
    const textWithWhiteSpace = ` \t  ${text}\n `
    assert.deepEqual(getReadingTime(text), getReadingTime(textWithWhiteSpace))
  })
  it("handles custom reading speed", () => {
    const WORDS_PER_MINUTE = 100
    assert.notEqual(
      getReadingTime(text),
      getReadingTime(text, { wordsPerMinute: WORDS_PER_MINUTE }),
    )
    assert.equal(
      getReadingTime(text, { wordsPerMinute: 1 }).milliseconds,
      2 * getReadingTime(text, { wordsPerMinute: 2 }).milliseconds,
    )
  })
})
