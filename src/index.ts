interface CountCharactersOptions {
	unit?: "code-unit" | "grapheme"
}

/**
 * Count the number of characters in a text.
 *
 * @param text - The text to analyze.
 * @param options.unit - `"grapheme"` (default) counts user-perceived characters
 *   (e.g. emoji like `"👨‍👩‍👧"` counts as 1). `"code-unit"` counts UTF-16 code
 *   units, matching `String.prototype.length`.
 */
export function countCharacters(
	text: string,
	options?: CountCharactersOptions,
): number {
	const unit = options?.unit ?? "grapheme"
	if (unit === "code-unit") {
		return text.length
	}
	const segmenter = new Intl.Segmenter()
	let count = 0
	for (const _ of segmenter.segment(text)) {
		count++
	}
	return count
}

/**
 * Count the number of words in a text. Words are separated by any whitespace.
 */
export function countWords(text: string): number {
	const trimmed = text.trim()
	if (trimmed === "") {
		return 0
	}
	return trimmed.split(/\s+/).length
}

interface CountSequenceOccurrencesOptions {
	caseSensitive?: boolean
	overlapping?: boolean
}

/**
 * Count the number of times a sequence occurs in a text.
 *
 * @param text - The text to search in.
 * @param sequence - The sequence to search for. Must be non-empty.
 * @param options.caseSensitive - Defaults to `true`.
 * @param options.overlapping - When `true`, overlapping matches are counted
 *   (e.g. `"aa"` matches 3 times in `"aaaa"`). Defaults to `false`.
 */
export function countSequenceOccurrences(
	text: string,
	sequence: string,
	options?: CountSequenceOccurrencesOptions,
): number {
	if (sequence === "") {
		return 0
	}
	const caseSensitive = options?.caseSensitive ?? true
	const overlapping = options?.overlapping ?? false
	const haystack = caseSensitive ? text : text.toLowerCase()
	const needle = caseSensitive ? sequence : sequence.toLowerCase()
	if (overlapping) {
		let count = 0
		let index = haystack.indexOf(needle)
		while (index !== -1) {
			count++
			index = haystack.indexOf(needle, index + 1)
		}
		return count
	}
	return haystack.split(needle).length - 1
}

const DEFAULT_WORDS_PER_MINUTE = 200

interface ReadingTimeOptions {
	wordsPerMinute?: number
}

interface ReadingTime {
	words: number
	minutes: number
	milliseconds: number
}

/**
 * Estimate the reading time for a text.
 *
 * @param text - The text to analyze.
 * @param options.wordsPerMinute - Reading speed. Must be greater than 0.
 *   Defaults to 200.
 */
export function getReadingTime(
	text: string,
	options?: ReadingTimeOptions,
): ReadingTime {
	const wordsPerMinute = options?.wordsPerMinute ?? DEFAULT_WORDS_PER_MINUTE
	if (wordsPerMinute <= 0) {
		throw new RangeError("wordsPerMinute must be greater than 0")
	}
	const words = countWords(text)
	const minutes = words / wordsPerMinute
	const milliseconds = minutes * 60 * 1000
	return { words, minutes, milliseconds }
}
