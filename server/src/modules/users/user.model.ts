export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  role_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  role_id: number;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  password?: string;
  role_id?: number;
}

export interface DbUser {
  id: number;
  email: string;
  password: string;
  role: string;
  role_id: number;
  name: string;
}
