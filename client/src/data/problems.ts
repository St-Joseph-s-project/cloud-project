import type { Problem } from "../types";

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    difficulty: "Easy",
    category: "Algorithms",
    samples: [
      {
        id: "s1",
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        id: "s2",
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    testCases: [
      { id: "t1", input: "2 7 11 15\n9", output: "0 1" },
      { id: "t2", input: "3 2 4\n6", output: "1 2" },
    ],
  },
  {
    id: "2",
    title: "Reverse Linked List",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "Easy",
    category: "Data Structures",
    samples: [
      {
        id: "s1",
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
    ],
    testCases: [{ id: "t1", input: "1 2 3 4 5", output: "5 4 3 2 1" }],
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    category: "Algorithms",
    samples: [
      {
        id: "s1",
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
    ],
    testCases: [
      { id: "t1", input: "abcabcbb", output: "3" },
      { id: "t2", input: "bbbbb", output: "1" },
    ],
  },
  {
    id: "4",
    title: "Select All Users",
    description: "Write a query to select all users from the user table.",
    difficulty: "Easy",
    category: "SQL Database",
    samples: [],
    testCases: [],
  },
  {
    id: "5",
    title: "LRU Cache",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    difficulty: "Hard",
    category: "System Design",
    samples: [],
    testCases: [],
  },
];
