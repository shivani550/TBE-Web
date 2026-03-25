import type { StudyGuideConfig } from "@tbe/types";

export const DSA_STUDY_GUIDE_CONFIGS: Record<string, StudyGuideConfig> = {
  ARRAY: {
    topic: "Arrays",
    hasStudyGuide: true,
    sections: [
      { id: "before-you-start", label: "Before you start" },
      { id: "how-arrays-work", label: "How Arrays work" },
      { divider: "Patterns" },
      { id: "two-pointers", label: "Two pointers" },
      { id: "sliding-window", label: "Sliding window" },
      { id: "hash-map", label: "Hash map" },
      { id: "prefix-sum", label: "Prefix sum" },
      { id: "kadanes", label: "Kadane's algorithm" },
      { divider: null },
      { id: "cheat-sheet", label: "Cheat sheet" },
    ],
  },
  STRING: {
    topic: "Strings",
    hasStudyGuide: true,
    sections: [
      { id: "before-you-start", label: "Before you start" },
      { id: "how-strings-work", label: "How Strings work" },
      { divider: "Patterns" },
      { id: "two-pointers", label: "Two pointers" },
      { id: "frequency-counting", label: "Frequency Counting" },
      { divider: null },
      { id: "cheat-sheet", label: "Cheat sheet" },
    ],
  },
  HASHMAP: {
    topic: "Hash Map",
    hasStudyGuide: true,
    sections: [
      { id: "introduction", label: "Introduction" },
      { id: "hashing-basics", label: "Hashing basics" },
      { divider: "Patterns" },
      { id: "counting-elements", label: "Counting elements" },
      { id: "checking-existence", label: "Checking existence" },
      { divider: null },
      { id: "cheat-sheet", label: "Cheat sheet" },
    ],
  },
  TWO_POINTERS: {
    topic: "Two Pointers",
    hasStudyGuide: true,
    sections: [
      { id: "introduction", label: "Introduction" },
      { divider: "Patterns" },
      { id: "opposite-ends", label: "Opposite ends" },
      { id: "fast-and-slow", label: "Fast and slow pointers" },
      { divider: null },
      { id: "cheat-sheet", label: "Cheat sheet" },
    ],
  },
  BINARY_SEARCH: {
    topic: "Binary Search",
    hasStudyGuide: true,
    sections: [
      { id: "introduction", label: "Introduction" },
      { divider: "Patterns" },
      { id: "iterative-search", label: "Iterative search" },
      { id: "recursive-search", label: "Recursive search" },
      { id: "find-first-and-last", label: "Find first/last" },
      { divider: null },
      { id: "cheat-sheet", label: "Cheat sheet" },
    ],
  },
  LINKED_LIST: {
    topic: "Linked List",
    hasStudyGuide: true,
    sections: [
      { id: "basics", label: "LL Basics" },
      { divider: "Patterns" },
      { id: "reversing", label: "Reversing" },
      { id: "detecting-cycles", label: "Cycle detection" },
      { divider: null },
      { id: "cheat-sheet", label: "Cheat sheet" },
    ],
  },
};
