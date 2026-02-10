export interface Test {
  id: number;
  name: string;
  batch_id?: number;
  college_id?: number;
  start_time: Date;
  end_time: Date;
  status?: string;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TestCreateInput {
  name: string;
  batch_id?: number;
  college_id?: number;
  start_time: Date;
  end_time: Date;
  created_by: number;
}

export interface TestUpdateInput {
  name?: string;
  batch_id?: number;
  college_id?: number;
  start_time?: Date;
  end_time?: Date;
  status?: string;
  created_by?: number;
}

export interface TestProblemMapping {
  test_id: number;
  problem_id: number;
}
