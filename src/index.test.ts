import { describe, expect, it } from "vitest"
import {
	countCharacters,
	countSequenceOccurrences,
	countWords,
	getReadingTime,
} from "./index"

const TEXT =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

describe("countCharacters", () => {
	it("handles empty string", () => {
		expect(countCharacters("")).toBe(0)
	})
	it("handles non-empty string", () => {
		expect(countCharacters("text")).toBe(4)
	})
	it("handles white space", () => {
		expect(countCharacters("\n \t")).toBe(3)
	})
	it("counts emoji as one grapheme by default", () => {
		expect(countCharacters("👨‍👩‍👧")).toBe(1)
	})
	it("counts UTF-16 code units when requested", () => {
		expect(countCharacters("👨‍👩‍👧", { unit: "code-unit" })).toBe(8)
	})
})

describe("countWords", () => {
	it("handles empty string", () => {
		expect(countWords("")).toBe(0)
	})
	it("handles non-empty string", () => {
		expect(countWords("text text text")).toBe(3)
	})
	it("handles white space", () => {
		expect(countWords("\n \t")).toBe(0)
	})
	it("handles leading and trailing white space", () => {
		expect(countWords(" text  \n")).toBe(1)
	})
	it("handles CRLF line endings", () => {
		expect(countWords("one\r\ntwo\r\nthree")).toBe(3)
	})
	it("handles non-breaking spaces", () => {
		expect(countWords("one two")).toBe(2)
	})
})

describe("countSequenceOccurrences", () => {
	it("handles empty text", () => {
		expect(countSequenceOccurrences("", "text")).toBe(0)
	})
	it("handles empty sequence", () => {
		expect(countSequenceOccurrences("abc", "")).toBe(0)
	})
	it("is case sensitive by default", () => {
		expect(countSequenceOccurrences(TEXT, "dolor")).toBe(4)
		expect(countSequenceOccurrences(TEXT, "Dolor")).toBe(0)
	})
	it("supports case insensitive matching", () => {
		expect(
			countSequenceOccurrences(TEXT, "doLOR", { caseSensitive: false }),
		).toBe(4)
	})
	it("does not count overlapping matches by default", () => {
		expect(countSequenceOccurrences("aaaa", "aa")).toBe(2)
	})
	it("counts overlapping matches when requested", () => {
		expect(countSequenceOccurrences("aaaa", "aa", { overlapping: true })).toBe(
			3,
		)
	})
})

describe("getReadingTime", () => {
	it("handles empty string", () => {
		expect(getReadingTime("")).toEqual({
			words: 0,
			minutes: 0,
			milliseconds: 0,
		})
	})
	it("handles non-empty string", () => {
		expect(getReadingTime(TEXT)).toEqual({
			words: 69,
			minutes: 0.345,
			milliseconds: 20700,
		})
	})
	it("handles white space", () => {
		const textWithWhiteSpace = ` \t  ${TEXT}\n `
		expect(getReadingTime(textWithWhiteSpace)).toEqual(getReadingTime(TEXT))
	})
	it("handles custom reading speed", () => {
		expect(getReadingTime(TEXT, { wordsPerMinute: 1 }).minutes).toBe(
			2 * getReadingTime(TEXT, { wordsPerMinute: 2 }).minutes,
		)
	})
	it("throws when wordsPerMinute is zero", () => {
		expect(() => getReadingTime(TEXT, { wordsPerMinute: 0 })).toThrow(
			RangeError,
		)
	})
	it("throws when wordsPerMinute is negative", () => {
		expect(() => getReadingTime(TEXT, { wordsPerMinute: -1 })).toThrow(
			RangeError,
		)
	})
})
