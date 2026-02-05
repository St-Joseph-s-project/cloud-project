export const ROLES = {
    ADMIN: 'admin',
    MENTOR: 'mentor',
    STUDENT: 'student'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_IDS = {
    ADMIN: 1,
    MENTOR: 2,
    STUDENT: 3
} as const;
