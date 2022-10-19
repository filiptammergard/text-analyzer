export function countCharacters(text: string) {
	const characters = text.length
	return characters
}

export function countWords(text: string) {
	const words = text.split(/ |\t|\n|\r/).filter((word) => word !== "").length
	return words
}

interface SequenceOccurancesOptions {
	caseSensitivity?: "sensitive" | "insensitive"
}

export function countSequenceOccurances(
	text: string,
	sequence: string,
	options?: SequenceOccurancesOptions,
) {
	const resolvedOptions = {
		caseSensitivity: options?.caseSensitivity ?? "insensitive",
	}
	if (resolvedOptions.caseSensitivity === "sensitive") {
		const occurances = text.split(sequence).length - 1
		return occurances
	}
	const occurances = text.toLowerCase().split(sequence.toLowerCase()).length - 1
	return occurances
}

const DEFAULT_WORDS_PER_MINUTE = 200

interface ReadingTimeOptions {
	wordsPerMinute?: number
}

export function getReadingTime(text: string, options?: ReadingTimeOptions) {
	const resolvedOptions = {
		wordsPerMinute: options?.wordsPerMinute ?? DEFAULT_WORDS_PER_MINUTE,
	}
	const words = countWords(text)
	const minutes = words / resolvedOptions.wordsPerMinute
	const milliseconds = minutes * 60 * 1000
	return {
		words,
		minutes,
		milliseconds,
	}
}
