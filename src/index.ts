interface CountCharactersOptions {
	unit?: "code-unit" | "grapheme"
	locale?: string
	normalize?: boolean
}

const defaultGraphemeSegmenter = new Intl.Segmenter()

/**
 * Count the number of characters in a text.
 *
 * @param text - The text to analyze.
 * @param options.unit - `"grapheme"` (default) counts user-perceived characters
 *   (e.g. emoji like `"👨‍👩‍👧"` counts as 1). `"code-unit"` counts UTF-16 code
 *   units, matching `String.prototype.length`.
 * @param options.locale - BCP 47 locale tag passed to `Intl.Segmenter`.
 *   Only used when `unit` is `"grapheme"`.
 * @param options.normalize - When `true`, normalize the text to NFC before
 *   counting. Defaults to `false`.
 */
export function countCharacters(
	text: string,
	options?: CountCharactersOptions,
): number {
	const normalized = options?.normalize ? text.normalize() : text
	if ((options?.unit ?? "grapheme") === "code-unit") {
		return normalized.length
	}
	const segmenter = options?.locale
		? new Intl.Segmenter(options.locale)
		: defaultGraphemeSegmenter
	return [...segmenter.segment(normalized)].length
}

/**
 * Count the number of words in a text. Words are separated by any whitespace.
 *
 * Note: This is a whitespace-based count, so punctuation stays attached
 * (`"hello, world"` counts as 2 words: `"hello,"` and `"world"`). For a
 * linguistic word count, use {@link getWordFrequency} which uses
 * `Intl.Segmenter`.
 */
export function countWords(text: string): number {
	const trimmed = text.trim()
	if (trimmed === "") {
		return 0
	}
	return trimmed.split(/\s+/).length
}

/**
 * Count the number of lines in a text. Handles `\n`, `\r\n`, and `\r`.
 *
 * A trailing line terminator does not add an extra empty line, so
 * `"one\n"` counts as 1 line.
 */
export function countLines(text: string): number {
	if (text === "") {
		return 0
	}
	const terminators = text.match(/\r\n|\r|\n/g)?.length ?? 0
	const endsWithTerminator = text.endsWith("\n") || text.endsWith("\r")
	return endsWithTerminator ? terminators : terminators + 1
}

interface CountSentencesOptions {
	locale?: string
}

const defaultSentenceSegmenter = new Intl.Segmenter(undefined, {
	granularity: "sentence",
})

/**
 * Count the number of sentences in a text. Uses `Intl.Segmenter` for
 * Unicode-aware sentence boundary detection.
 *
 * @param options.locale - BCP 47 locale tag passed to `Intl.Segmenter`.
 */
export function countSentences(
	text: string,
	options?: CountSentencesOptions,
): number {
	if (text.trim() === "") {
		return 0
	}
	const segmenter = options?.locale
		? new Intl.Segmenter(options.locale, { granularity: "sentence" })
		: defaultSentenceSegmenter
	let count = 0
	for (const segment of segmenter.segment(text)) {
		if (segment.segment.trim() !== "") {
			count++
		}
	}
	return count
}

/**
 * Count the number of paragraphs in a text. Paragraphs are separated by one
 * or more blank lines.
 */
export function countParagraphs(text: string): number {
	if (text.trim() === "") {
		return 0
	}
	return text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== "")
		.length
}

interface CountSequenceOccurrencesOptions {
	caseSensitive?: boolean
	overlapping?: boolean
	locale?: string
	normalize?: boolean
}

/**
 * Count the number of times a sequence occurs in a text.
 *
 * @param text - The text to search in.
 * @param sequence - The sequence to search for. Must be non-empty.
 * @param options.caseSensitive - Defaults to `true`.
 * @param options.overlapping - When `true`, overlapping matches are counted
 *   (e.g. `"aa"` matches 3 times in `"aaaa"`). Defaults to `false`.
 * @param options.locale - BCP 47 locale tag used for case folding (only
 *   relevant when `caseSensitive` is `false`).
 * @param options.normalize - When `true`, normalize both `text` and `sequence`
 *   to NFC before searching. Defaults to `false`.
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
	const normalize = options?.normalize ?? false
	const locale = options?.locale

	const prepare = (value: string): string => {
		const normalized = normalize ? value.normalize() : value
		if (caseSensitive) {
			return normalized
		}
		return locale
			? normalized.toLocaleLowerCase(locale)
			: normalized.toLowerCase()
	}
	const haystack = prepare(text)
	const needle = prepare(sequence)

	if (overlapping) {
		let count = 0
		for (
			let i = haystack.indexOf(needle);
			i !== -1;
			i = haystack.indexOf(needle, i + 1)
		) {
			count++
		}
		return count
	}
	return haystack.split(needle).length - 1
}

interface GetWordFrequencyOptions {
	caseSensitive?: boolean
	locale?: string
}

const defaultWordSegmenter = new Intl.Segmenter(undefined, {
	granularity: "word",
})

/**
 * Count how many times each word occurs in a text. Words are detected with
 * `Intl.Segmenter`, so punctuation is excluded and contractions like
 * `"don't"` are kept as one word.
 *
 * The returned map is sorted by count in descending order. Ties keep their
 * order of first occurrence.
 *
 * @param options.caseSensitive - Defaults to `true`. Pass `false` for
 *   typical natural-language frequency analysis where `"The"` and `"the"`
 *   should be treated as the same word.
 * @param options.locale - BCP 47 locale tag passed to `Intl.Segmenter` and
 *   used for case folding.
 */
export function getWordFrequency(
	text: string,
	options?: GetWordFrequencyOptions,
): Map<string, number> {
	const caseSensitive = options?.caseSensitive ?? true
	const locale = options?.locale
	const segmenter = locale
		? new Intl.Segmenter(locale, { granularity: "word" })
		: defaultWordSegmenter

	const counts = new Map<string, number>()
	for (const segment of segmenter.segment(text)) {
		if (!segment.isWordLike) {
			continue
		}
		const word = caseSensitive
			? segment.segment
			: locale
				? segment.segment.toLocaleLowerCase(locale)
				: segment.segment.toLowerCase()
		counts.set(word, (counts.get(word) ?? 0) + 1)
	}
	return new Map([...counts.entries()].sort(([, a], [, b]) => b - a))
}

interface GetAverageWordLengthOptions {
	unit?: "code-unit" | "grapheme"
	locale?: string
}

/**
 * Compute the average length of words in a text. Returns `0` when the text
 * contains no words.
 *
 * Word splitting is whitespace-based (matches {@link countWords}).
 *
 * @param options.unit - Passed to {@link countCharacters}.
 * @param options.locale - Passed to {@link countCharacters}.
 */
export function getAverageWordLength(
	text: string,
	options?: GetAverageWordLengthOptions,
): number {
	const trimmed = text.trim()
	if (trimmed === "") {
		return 0
	}
	const words = trimmed.split(/\s+/)
	const totalLength = words.reduce(
		(sum, word) => sum + countCharacters(word, options),
		0,
	)
	return totalLength / words.length
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
