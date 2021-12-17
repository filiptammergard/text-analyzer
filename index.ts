export function countCharacters(text: string) {
  const characters = text.length
  return characters
}

export function countWords(text: string) {
  const words = text.split(/ |\t|\n|\r/).filter((word) => word !== "").length
  return words
}

export function countSequenceOccurances(text: string, sequence: string) {
  const occurances = text.toLowerCase().split(sequence.toLowerCase()).length - 1
  return occurances
}

const WORDS_PER_MINUTE = 200

export function getReadingTime(text: string) {
  const words = countWords(text)
  const minutes = words / WORDS_PER_MINUTE
  const milliseconds = minutes * 60 * 1000
  return {
    words,
    minutes,
    milliseconds,
  }
}
