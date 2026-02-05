import pool from "../../config/database.ts";
import type {
  Test,
  TestCreateInput,
  TestUpdateInput,
  TestProblemMapping
} from "./test.model.ts";

export class TestService {
  /**
   * Create a new test
   */
  async createTest(input: TestCreateInput): Promise<Test> {
    const { name, batch_id, college_id, start_time, end_time, created_by } = input;

    const query = `
      INSERT INTO tests (
        name, 
        batch_id, 
        college_id, 
        start_time, 
        end_time, 
        created_by
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `;

    const result = await pool.query<Test>(query, [
      name,
      batch_id,
      college_id,
      start_time,
      end_time,
      created_by
    ]);

    return result.rows[0];
  }

  /**
   * Get all tests
   */
  async getAllTests(): Promise<Test[]> {
    const query = `
      SELECT * FROM tests;
    `;
    const result = await pool.query<Test>(query);
    return result.rows;
  }

  /**
   * Get test by ID
   */
  async getTestById(id: number): Promise<Test | null> {
    const query = `
      SELECT * FROM tests WHERE id = $1;
    `;
    const result = await pool.query<Test>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Update a test
   */
  async updateTest(id: number, input: TestUpdateInput): Promise<Test> {
    const { name, batch_id, college_id, start_time, end_time, status, created_by } = input;

    const query = `
      UPDATE tests SET 
        name = $1,
        batch_id = $2,
        college_id = $3,
        start_time = $4,
        end_time = $5,
        status = $6,
        created_by = $7
      WHERE id = $8
      RETURNING *;
    `;

    const result = await pool.query<Test>(query, [
      name,
      batch_id,
      college_id,
      start_time,
      end_time,
      status,
      created_by,
      id
    ]);

    return result.rows[0];
  }

  /**
   * Update test status
   */
  async updateTestStatus(id: number, status: string): Promise<Test> {
    const query = `
      UPDATE tests SET 
        status = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query<Test>(query, [status, id]);
    return result.rows[0];
  }

  /**
   * Delete a test
   */
  async deleteTest(id: number): Promise<void> {
    const query = `
      DELETE FROM tests WHERE id = $1;
    `;
    await pool.query(query, [id]);
  }

  /**
   * Map problems to a test
   */
  async mapProblemsToTest(mapping: TestProblemMapping): Promise<void> {
    const { test_id, problem_id } = mapping;

    const query = `
      INSERT INTO test_problems (test_id, problem_id) 
      VALUES ($1, $2);
    `;

    await pool.query(query, [test_id, problem_id]);
  }
}

export const testService = new TestService();
