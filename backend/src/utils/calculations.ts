export const getWPM = (letters: number, seconds: number) =>
  Math.round(letters / 5 / (seconds / 60))
