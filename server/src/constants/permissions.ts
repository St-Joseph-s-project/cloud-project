export const PERMISSIONS = {
  CREATE_PROBLEM: "create:problem",
  UPDATE_PROBLEM: "update:problem",
  DELETE_PROBLEM: "delete:problem",
  VIEW_PROBLEM: "view:problem",

  CREATE_TEST: "create:test",
  UPDATE_TEST: "update:test",
  DELETE_TEST: "delete:test",
  VIEW_TEST: "view:test",

  MANAGE_USERS: "manage:users",
  VIEW_SUBMISSIONS: "view:submissions",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
