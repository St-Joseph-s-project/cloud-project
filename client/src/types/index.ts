export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category =
  | "SQL Database"
  | "Data Structures"
  | "Algorithms"
  | "OS"
  | "System Design";

export interface TestCase {
  id: string;
  input: string;
  output: string;
}

export interface Sample {
  id: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  samples: Sample[];
  testCases: TestCase[];
}

export interface User {
  username: string;
  role: "admin" | "student";
  rollNumber?: string;
  email?: string;
}
