export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MENTOR: "FACULTY",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_IDS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MENTOR: 3,
  STUDENT: 4,
} as const;
