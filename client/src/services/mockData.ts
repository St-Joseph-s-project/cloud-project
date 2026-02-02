// =======================
// ENUMS (Refactored to const objects for compatibility)
// =======================

export const DifficultyEnum = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;
export type DifficultyEnum =
  (typeof DifficultyEnum)[keyof typeof DifficultyEnum];

export const TestStatusEnum = {
  NOT_SCHEDULED: "NOT_SCHEDULED",
  SCHEDULED: "SCHEDULED",
  LIVE: "LIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type TestStatusEnum =
  (typeof TestStatusEnum)[keyof typeof TestStatusEnum];

export const TestAttemptStatusEnum = {
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
} as const;
export type TestAttemptStatusEnum =
  (typeof TestAttemptStatusEnum)[keyof typeof TestAttemptStatusEnum];

export const SubmissionStatusEnum = {
  NOT_ATTEMPTED: "NOT_ATTEMPTED",
  SOLVED: "SOLVED",
  WRONG_ANSWER: "WRONG_ANSWER",
} as const;
export type SubmissionStatusEnum =
  (typeof SubmissionStatusEnum)[keyof typeof SubmissionStatusEnum];

// =======================
// INTERFACES
// =======================

export interface College {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Batch {
  id: number;
  batch_year: string; // Changed from 'name'/'year' to match schema 'batch_year'
  name: string; // Keeping name for UI usage if needed, or mapping batch_year to it
}

export interface Role {
  id: number;
  role: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  is_super_admin: boolean;
  college_id: number | null;
  department_id: number | null;
  created_at: string;
  last_login: string;

  // UI Helpers
  roleName: string;
  username: string; // Keeping for backward compatibility with existing components
}

export interface StudentProfile {
  id: number;
  user_id: number;
  department_id: number;
  batch_id: number;
  mentor_id: number;
}

export interface StudentPlatformProfile {
  id: number;
  student_id: number;
  leetcode: string; // e.g., "alice_lc"
  hackerrank: string;
  codeforces: string;
  atcoder: string;
  skillrack: string;
  codechef: string;
}

// Combined Interface for UI Convenience
export interface StudentUI extends User {
  profile_id: number;
  batch_id: number;
  mentor_id: number;
  platform_profile?: StudentPlatformProfile;

  // Helper names
  departmentName: string;
  batchName: string;
  mentorName: string;
  status: "active" | "graduated" | "dropped"; // Not in schema but required for UI stats
  gender: "Male" | "Female" | "Other"; // Not in schema but required for UI stats
}

// =======================
// MOCK DATA
// =======================

export const colleges: College[] = [
  { id: 1, name: "St. Joseph's Institute of Technology" },
];

export const departments: Department[] = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Information Technology" },
  { id: 3, name: "Electronics & Communication" },
  { id: 4, name: "Mechanical Engineering" },
];

export const batches: Batch[] = [
  { id: 1, batch_year: "2023", name: "Batch 2023" },
  { id: 2, batch_year: "2024", name: "Batch 2024" },
  { id: 3, batch_year: "2025", name: "Batch 2025" },
  { id: 4, batch_year: "2026", name: "Batch 2026" },
];

export const roles: Role[] = [
  { id: 1, role: "Super Admin" },
  { id: 2, role: "Admin" },
  { id: 3, role: "Mentor" },
  { id: 4, role: "Student" },
];

// Mentors (Users with Role ID 3)
export const mentors: User[] = [
  {
    id: 101,
    name: "Dr. Smith",
    email: "smith@college.edu",
    role_id: 3,
    is_super_admin: false,
    college_id: 1,
    department_id: 1,
    created_at: "2023-01-01",
    last_login: "2023-10-10",
    roleName: "Mentor",
    username: "Dr. Smith",
  },
  {
    id: 102,
    name: "Prof. Johnson",
    email: "johnson@college.edu",
    role_id: 3,
    is_super_admin: false,
    college_id: 1,
    department_id: 2,
    created_at: "2023-01-01",
    last_login: "2023-10-10",
    roleName: "Mentor",
    username: "Prof. Johnson",
  },
];

const firstNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Hannah",
  "Ivy",
  "Jack",
  "Kevin",
  "Liam",
  "Mia",
  "Noah",
  "Olivia",
  "Paul",
  "Quinn",
  "Ryan",
  "Sophia",
  "Tom",
];
const lastNames = [
  "Doe",
  "Smith",
  "Johnson",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
];

const generateStudents = (count: number): StudentUI[] => {
  const students: StudentUI[] = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];
    const batch = batches[Math.floor(Math.random() * batches.length)];
    const mentor = mentors[Math.floor(Math.random() * mentors.length)];
    const status =
      Math.random() > 0.8
        ? Math.random() > 0.5
          ? "graduated"
          : "dropped"
        : "active";
    const gender = Math.random() > 0.5 ? "Male" : "Female";
    const userId = 1000 + i;

    students.push({
      id: userId,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edu`,
      username: `${firstName.toLowerCase()}${i}`,
      role_id: 4,
      is_super_admin: false,
      college_id: 1,
      department_id: department.id,
      created_at: new Date(
        2023,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      )
        .toISOString()
        .split("T")[0],
      last_login: new Date().toISOString(),
      roleName: "Student",

      // Profile fields
      profile_id: i,
      batch_id: batch.id,
      mentor_id: mentor.id,

      // UI Helpers
      departmentName: department.name,
      batchName: batch.name,
      mentorName: mentor.name,
      status: status,
      gender: gender,

      // Platform Profile
      platform_profile: {
        id: i,
        student_id: i,
        leetcode: `${firstName.toLowerCase()}_lc`,
        hackerrank: `${firstName.toLowerCase()}_hr`,
        codeforces: `${firstName.toLowerCase()}_cf`,
        atcoder: `${firstName.toLowerCase()}_ac`,
        skillrack: `${firstName.toLowerCase()}_sr`,
        codechef: `${firstName.toLowerCase()}_cc`,
      },
    });
  }
  return students;
};

// Helper to persist to localStorage (Simulating DB)
const loadStudentsFromStorage = (): StudentUI[] => {
  try {
    const stored = localStorage.getItem("mock_students");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load from storage", e);
  }
  const initial = generateStudents(150);
  localStorage.setItem("mock_students", JSON.stringify(initial));
  return initial;
};

export const mockStudents = loadStudentsFromStorage();

export const addMockStudent = (student: StudentUI) => {
  mockStudents.unshift(student);
  localStorage.setItem("mock_students", JSON.stringify(mockStudents));
};

export const updateMockStudent = (student: StudentUI) => {
  const index = mockStudents.findIndex((s) => s.id === student.id);
  if (index !== -1) {
    mockStudents[index] = student;
    localStorage.setItem("mock_students", JSON.stringify(mockStudents));
  }
};

export const deleteMockStudent = (id: number) => {
  const index = mockStudents.findIndex((s) => s.id === id);
  if (index !== -1) {
    mockStudents.splice(index, 1);
    localStorage.setItem("mock_students", JSON.stringify(mockStudents));
  }
};

export const bulkAddMockStudents = (students: StudentUI[]) => {
  // Add new students to the beginning
  students.forEach((s) => mockStudents.unshift(s));
  localStorage.setItem("mock_students", JSON.stringify(mockStudents));
};
