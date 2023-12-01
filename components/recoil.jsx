import { atom } from "recoil";

export const testExpressionState = atom({
  key: "testExpressionState",
  default: [
    "should",
    "so...that",
    "too...to",
    "enough to",
    "should",
    "prefer A to B",
    "should",
  ],
});

export const testGrammarState = atom({
  key: "testGrammarState",
  default: [3, 4, 6, 8, 10, 5, 6],
});

export const testSubjectState = atom({
  key: "testSubjectState",
  default: [7, 4, 2, 9, 7, 7, 5],
});

export const testUseState = atom({
  key: "testUseState",
  default: [1, 10, 10, 1, 1, 10, 10],
});
