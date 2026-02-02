import {
  mockStudents,
  departments,
  batches,
  mentors,
  addMockStudent,
} from "./mockData";
import type { StudentUI } from "./mockData";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchDashboardStats = async () => {
  await delay(500);

  const totalStudents = mockStudents.length;

  // Status Summary
  const statusStats = {
    active: mockStudents.filter((s) => s.status === "active").length,
    graduated: mockStudents.filter((s) => s.status === "graduated").length,
    dropped: mockStudents.filter((s) => s.status === "dropped").length,
  };

  return {
    totalStudents,
    statusStats,
  };
};

export const fetchReportsData = async () => {
  await delay(600);

  // Department-wise
  const departmentStats = departments.map((dept) => ({
    name: dept.name,
    value: mockStudents.filter((s) => s.department_id === dept.id).length,
  }));

  // Batch-wise
  const batchStats = batches.map((batch) => ({
    name: batch.name,
    students: mockStudents.filter((s) => s.batch_id === batch.id).length,
  }));

  // Gender Distribution
  const genderStats = [
    {
      name: "Male",
      value: mockStudents.filter((s) => s.gender === "Male").length,
    },
    {
      name: "Female",
      value: mockStudents.filter((s) => s.gender === "Female").length,
    },
  ];

  // Mentor Assignments
  const mentorStats = mentors.map((m) => ({
    name: m.name,
    students: mockStudents.filter((s) => s.mentor_id === m.id).length,
  }));

  return {
    departmentStats,
    batchStats,
    genderStats,
    mentorStats,
  };
};

export const fetchStudentProfiles = async (): Promise<StudentUI[]> => {
  await delay(300);
  return mockStudents;
};

export const fetchDepartments = async () => {
  await delay(100);
  return departments;
};

export const fetchBatches = async () => {
  await delay(100);
  return batches;
};

export const fetchMentors = async () => {
  await delay(100);
  return mentors;
};

export const createStudent = async (studentData: Partial<StudentUI>) => {
  await delay(400);

  /* 
     Fixing possible type mismatch:
     The select inputs return strings, but our interfaces expect numbers.
     We must explicitly convert them.
  */
  const deptId = Number(studentData.department_id) || 1;
  const batchId = Number(studentData.batch_id) || 1;
  const mentorId = Number(studentData.mentor_id) || 101;

  const newStudent: StudentUI = {
    id: Math.floor(Math.random() * 10000) + 2000,
    name: studentData.name || "New Student",
    email: studentData.email || "new@student.edu",
    username: (studentData.name || "new").toLowerCase().replace(/\s/g, ""),
    role_id: 4,
    is_super_admin: false,
    college_id: 1,
    department_id: deptId,
    created_at: new Date().toISOString().split("T")[0],
    last_login: new Date().toISOString(),
    roleName: "Student",
    profile_id: Math.floor(Math.random() * 10000),
    batch_id: batchId,
    mentor_id: mentorId,
    departmentName: departments.find((d) => d.id === deptId)?.name || "Unknown",
    batchName: batches.find((b) => b.id === batchId)?.name || "Unknown",
    mentorName: mentors.find((m) => m.id === mentorId)?.name || "Unknown",
    status: "active",
    gender: "Male",
    platform_profile: {
      id: Math.floor(Math.random() * 10000),
      student_id: 0,
      leetcode: "",
      hackerrank: "",
      codeforces: "",
      atcoder: "",
      skillrack: "",
      codechef: "",
    },
    // We intentionally do not spread studentData at the end to avoid overwriting typed IDs with strings
  };

  addMockStudent(newStudent);
  return newStudent;
};

import {
  updateMockStudent,
  deleteMockStudent,
  bulkAddMockStudents,
} from "./mockData";

export const updateStudentProfile = async (
  id: number,
  studentData: Partial<StudentUI>,
) => {
  await delay(300);
  // Find existing to merge
  const existing = mockStudents.find((s) => s.id === id);
  if (!existing) throw new Error("Student not found");

  const deptId = studentData.department_id
    ? Number(studentData.department_id)
    : existing.department_id;
  const batchId = studentData.batch_id
    ? Number(studentData.batch_id)
    : existing.batch_id;
  const mentorId = studentData.mentor_id
    ? Number(studentData.mentor_id)
    : existing.mentor_id;

  const updatedStudent: StudentUI = {
    ...existing,
    ...studentData,
    department_id: deptId,
    batch_id: batchId,
    mentor_id: mentorId,
    departmentName:
      departments.find((d) => d.id === deptId)?.name || existing.departmentName,
    batchName:
      batches.find((b) => b.id === batchId)?.name || existing.batchName,
    mentorName:
      mentors.find((m) => m.id === mentorId)?.name || existing.mentorName,
  };

  updateMockStudent(updatedStudent);
  return updatedStudent;
};

export const deleteStudentProfile = async (id: number) => {
  await delay(300);
  deleteMockStudent(id);
  return true;
};

export const bulkCreateStudents = async (studentsData: any[]) => {
  await delay(500);

  // Map Excel/CSV data to StudentUI structure
  const newStudents: StudentUI[] = studentsData.map((data, index) => {
    const dept = departments.find(
      (d) => d.name === data.department || d.name === data.Department,
    );
    const batch = batches.find(
      (b) => b.name === data.batch || b.name === data.Batch,
    );
    const mentor = mentors.find(
      (m) => m.name === data.mentor || m.name === data.Mentor,
    );

    const deptId = dept?.id || 1;
    const batchId = batch?.id || 1;
    const mentorId = mentor?.id || 101;

    return {
      id: Math.floor(Math.random() * 1000000) + index,
      name: data.name || data.Name || "Unknown",
      email: data.email || data.Email || `user${index}@example.com`,
      username:
        (data.name || data.Name || "user").toLowerCase().replace(/\s/g, "") +
        Math.floor(Math.random() * 100),
      role_id: 4,
      is_super_admin: false,
      college_id: 1,
      department_id: deptId,
      batch_id: batchId,
      mentor_id: mentorId,
      departmentName: dept?.name || "Unknown",
      batchName: batch?.name || "Unknown",
      mentorName: mentor?.name || "Unknown",
      status: "active",
      gender: "Male",
      created_at: new Date().toISOString().split("T")[0],
      last_login: new Date().toISOString(),
      roleName: "Student",
      profile_id: Math.floor(Math.random() * 1000000),
      placeform_profile: {},
    } as StudentUI;
  });

  bulkAddMockStudents(newStudents);
  return newStudents;
};
