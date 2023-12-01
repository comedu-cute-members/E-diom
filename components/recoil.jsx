import { atom } from "recoil";
import AVLTree from "avl";

const tree = new AVLTree();
tree.load(
  [11, 18, 18, 18, 19, 22, 21],
  [
    "should",
    "so...that",
    "too...to",
    "enough to",
    "get rid of",
    "prefer A to B",
    "apply to",
  ],
  true
);

export const testSumState = atom({
  key: "testSumState",
  default: tree,
});

export const testScore = atom({
  key: "testScore",
  default: 18.14,
});

export const testExpressionState = atom({
  key: "testExpressionState",
  default: [
    "should",
    "so...that",
    "too...to",
    "enough to",
    "get rid of",
    "prefer A to B",
    "apply to",
  ],
});

export const testGrammarState = atom({
  key: "testGrammarState",
  default: [3, 4, 6, 8, 10, 5, 6],
});

export const testSubjectState = atom({
  key: "testSubjectState",
  default: [7, 4, 2, 9, 8, 7, 5],
});

export const testUseState = atom({
  key: "testUseState",
  default: [1, 10, 10, 1, 1, 10, 10],
});
