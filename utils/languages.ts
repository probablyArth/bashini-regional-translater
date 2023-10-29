export const languages: string[] = [
  "hi",
  "ta",
  "te",
  "ml",
  "mr",
  "bn",
  "as",
  "gu",
  "kn",
  "or",
  "pa",
];

export const isLanguageCodeInBound = (language: number): boolean => {
  if (language < 0 || language >= languages.length) {
    return false;
  }
  return true;
};
