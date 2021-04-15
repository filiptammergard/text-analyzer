declare module "text-analyzer" {
  function countWords(text: string): number;
  function countSequeces(text: string, sequence: string): number;
  function readingTime(
    text: string
  ): { words: number; minutes: number; milliseconds: number };
}
