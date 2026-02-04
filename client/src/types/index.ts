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
  isHidden?: boolean;
  weight?: number;
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
  category?: Category; // Made optional as removed from UI
  output_weight?: number;
  samples: Sample[];
  testCases: TestCase[];
}

export interface User {
  id?: number;
  username: string; // mapped from name in UI usually
  name?: string; // from backend
  role: "admin" | "student" | string;
  role_id?: number;
  rollNumber?: string;
  email?: string;
}
