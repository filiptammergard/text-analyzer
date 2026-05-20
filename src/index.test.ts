import { describe, expect, it } from "vitest"
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
	it("accepts a locale", () => {
		expect(countCharacters("åäö", { locale: "sv-SE" })).toBe(3)
	})
	it("normalizes when requested", () => {
		const nfd = "e\u0301"
		expect(countCharacters(nfd, { unit: "code-unit" })).toBe(2)
		expect(countCharacters(nfd, { unit: "code-unit", normalize: true })).toBe(1)
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
		expect(countWords("one two")).toBe(2)
	})
})

describe("countLines", () => {
	it("handles empty string", () => {
		expect(countLines("")).toBe(0)
	})
	it("counts a single line without terminator", () => {
		expect(countLines("one")).toBe(1)
	})
	it("counts a single line with trailing newline", () => {
		expect(countLines("one\n")).toBe(1)
	})
	it("counts multiple lines", () => {
		expect(countLines("one\ntwo\nthree")).toBe(3)
	})
	it("handles CRLF", () => {
		expect(countLines("one\r\ntwo\r\nthree")).toBe(3)
	})
	it("handles old-style Mac CR", () => {
		expect(countLines("one\rtwo\rthree")).toBe(3)
	})
	it("counts empty lines", () => {
		expect(countLines("\n\n")).toBe(2)
	})
})

describe("countSentences", () => {
	it("handles empty string", () => {
		expect(countSentences("")).toBe(0)
	})
	it("handles whitespace-only string", () => {
		expect(countSentences("   \n")).toBe(0)
	})
	it("counts simple sentences", () => {
		expect(countSentences("Hello. World!")).toBe(2)
	})
	it("counts a single sentence without terminator", () => {
		expect(countSentences("Hello world")).toBe(1)
	})
	it("does not split on decimals", () => {
		expect(countSentences("The value is 3.14. Done.")).toBe(2)
	})
})

describe("countParagraphs", () => {
	it("handles empty string", () => {
		expect(countParagraphs("")).toBe(0)
	})
	it("counts a single paragraph", () => {
		expect(countParagraphs("one line\nanother line")).toBe(1)
	})
	it("counts multiple paragraphs separated by blank line", () => {
		expect(countParagraphs("one\n\ntwo")).toBe(2)
	})
	it("collapses multiple blank lines", () => {
		expect(countParagraphs("one\n\n\n\ntwo")).toBe(2)
	})
	it("ignores leading and trailing blank lines", () => {
		expect(countParagraphs("\n\none\n\ntwo\n\n")).toBe(2)
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
	it("uses locale-aware case folding", () => {
		expect(
			countSequenceOccurrences("Istanbul", "i", { caseSensitive: false }),
		).toBe(1)
		expect(
			countSequenceOccurrences("Istanbul", "i", {
				caseSensitive: false,
				locale: "tr",
			}),
		).toBe(0)
	})
	it("normalizes when requested", () => {
		const nfc = "café"
		const nfd = "cafe\u0301"
		expect(countSequenceOccurrences(nfc, nfd)).toBe(0)
		expect(countSequenceOccurrences(nfc, nfd, { normalize: true })).toBe(1)
	})
})

describe("getWordFrequency", () => {
	it("handles empty string", () => {
		expect(getWordFrequency("")).toEqual(new Map())
	})
	it("counts word occurrences", () => {
		const freq = getWordFrequency("the cat sat on the mat")
		expect(freq.get("the")).toBe(2)
		expect(freq.get("cat")).toBe(1)
	})
	it("strips punctuation", () => {
		const freq = getWordFrequency("hello, world! hello.")
		expect(freq.get("hello")).toBe(2)
		expect(freq.get("world")).toBe(1)
		expect(freq.has(",")).toBe(false)
	})
	it("is case sensitive by default", () => {
		const freq = getWordFrequency("The the THE")
		expect(freq.get("The")).toBe(1)
		expect(freq.get("the")).toBe(1)
		expect(freq.get("THE")).toBe(1)
	})
	it("supports case insensitive counting", () => {
		expect(
			getWordFrequency("The the THE", { caseSensitive: false }).get("the"),
		).toBe(3)
	})
	it("keeps contractions as one word", () => {
		expect(getWordFrequency("don't don't").get("don't")).toBe(2)
	})
	it("sorts by count in descending order", () => {
		const freq = getWordFrequency("a a a b b c")
		expect([...freq.keys()]).toEqual(["a", "b", "c"])
	})
})

describe("getAverageWordLength", () => {
	it("handles empty string", () => {
		expect(getAverageWordLength("")).toBe(0)
	})
	it("handles whitespace-only string", () => {
		expect(getAverageWordLength("   \n")).toBe(0)
	})
	it("computes average over whitespace-separated tokens", () => {
		expect(getAverageWordLength("aa bbb cccc")).toBe(3)
	})
	it("counts graphemes by default", () => {
		expect(getAverageWordLength("👨‍👩‍👧 ab")).toBe(1.5)
	})
	it("can count UTF-16 code units", () => {
		expect(getAverageWordLength("👨‍👩‍👧 ab", { unit: "code-unit" })).toBe(5)
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
		const result = getReadingTime(TEXT)
		expect(result.words).toBe(69)
		expect(result.minutes).toBeCloseTo(0.345, 5)
		expect(result.milliseconds).toBeCloseTo(20700, 5)
	})
	it("handles white space", () => {
		const textWithWhiteSpace = ` \t  ${TEXT}\n `
		expect(getReadingTime(textWithWhiteSpace)).toEqual(getReadingTime(TEXT))
	})
	it("handles custom reading speed", () => {
		expect(getReadingTime(TEXT, { wordsPerMinute: 1 }).minutes).toBeCloseTo(
			2 * getReadingTime(TEXT, { wordsPerMinute: 2 }).minutes,
			5,
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
