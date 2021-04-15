export function countWords(text: string) {
  const words = text.split(/ |\t|\n|\r/).filter((word) => word !== "").length;
  return words;
}

export function countSequences(text: string, sequence: string) {
  const sequences = text.toLowerCase().split(sequence.toLowerCase()).length - 1;
  return sequences;
}

const WORDS_PER_MINUTE = 200;

export function getReadingTime(text: string) {
  const words = countWords(text);
  const minutes = words / WORDS_PER_MINUTE;
  const milliseconds = minutes * 60 * 1000;
  return {
    words,
    minutes,
    milliseconds,
  };
}
