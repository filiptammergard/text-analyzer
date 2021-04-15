"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readingTime = exports.countSequences = exports.countWords = void 0;
function countWords(text) {
    var words = text.split(/ |\t|\n|\r/).filter(function (word) { return word !== ""; }).length;
    return words;
}
exports.countWords = countWords;
function countSequences(text, sequence) {
    var sequences = text.toLowerCase().split(sequence.toLowerCase()).length - 1;
    return sequences;
}
exports.countSequences = countSequences;
var WORDS_PER_MINUTE = 200;
function readingTime(text) {
    var words = countWords(text);
    var minutes = words / WORDS_PER_MINUTE;
    var milliseconds = minutes * 60 * 1000;
    return {
        words: words,
        minutes: minutes,
        milliseconds: milliseconds,
    };
}
exports.readingTime = readingTime;
