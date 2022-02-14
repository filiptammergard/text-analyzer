import { assert, describe, it } from "vitest"
import {
  countCharacters,
  countSequenceOccurances,
  countWords,
  getReadingTime,
} from "./index"

const TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

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
    assert.equal(countSequenceOccurances(TEXT, "dolor"), 4)
  })
  it("handles case insensitive counting", () => {
    assert.equal(countSequenceOccurances(TEXT, "doLOR"), 4)
  })
  it("handles case sensitive counting", () => {
    assert.equal(
      countSequenceOccurances(TEXT, "doLOR", {
        caseSensitivity: "sensitive",
      }),
      0,
    )
  })
})

describe("getReadingTime", () => {
  it("handles empty string", () => {
    assert.equal(getReadingTime("").words, 0)
    assert.equal(getReadingTime("").minutes, 0)
    assert.equal(getReadingTime("").milliseconds, 0)
  })
  it("handles non-empty string", () => {
    assert.equal(getReadingTime(TEXT).words, 69)
    assert.equal(getReadingTime(TEXT).minutes, 0.345)
    assert.equal(getReadingTime(TEXT).milliseconds, 20700)
  })
  it("handles white space", () => {
    const textWithWhiteSpace = ` \t  ${TEXT}\n `
    assert.deepEqual(getReadingTime(TEXT), getReadingTime(textWithWhiteSpace))
  })
  it("handles custom reading speed", () => {
    assert.notEqual(
      getReadingTime(TEXT),
      getReadingTime(TEXT, { wordsPerMinute: 100 }),
    )
    assert.equal(
      getReadingTime(TEXT, { wordsPerMinute: 1 }).words,
      getReadingTime(TEXT, { wordsPerMinute: 2 }).words,
    )
    assert.equal(
      getReadingTime(TEXT, { wordsPerMinute: 1 }).minutes,
      2 * getReadingTime(TEXT, { wordsPerMinute: 2 }).minutes,
    )
    assert.equal(
      getReadingTime(TEXT, { wordsPerMinute: 1 }).milliseconds,
      2 * getReadingTime(TEXT, { wordsPerMinute: 2 }).milliseconds,
    )
  })
})
