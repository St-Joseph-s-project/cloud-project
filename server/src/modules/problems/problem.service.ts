import pool from "../../config/database.ts";
import type {
    Problem,
    ProblemCreateInput,
    ProblemUpdateInput,
    ProblemWithDetails
} from "./problem.model.ts";

export class ProblemService {
    /**
     * Create a new problem
     */
    async createProblem(input: ProblemCreateInput): Promise<Problem> {
        const { title, description, difficulty, created_by, is_published } = input;

        if (!title || created_by === undefined) {
            throw new Error("Title and Created By (User ID) are required");
        }

        const query = `
      INSERT INTO problems (
        title, 
        description, 
        difficulty, 
        order_index, 
        created_by, 
        is_published
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `;

        const values = [
            title,
            description || null,
            difficulty,
            0,
            Number(created_by),
            is_published ?? false
        ];

        const result = await pool.query<Problem>(query, values);
        return result.rows[0];
    }

    /**
     * Get all problems
     */
    async getAllProblems(): Promise<Problem[]> {
        const query = `
      SELECT id, title, description, module_id, difficulty, order_index, is_published 
      FROM problems;
    `;
        const result = await pool.query<Problem>(query);
        return result.rows;
    }

    /**
     * Get problem by ID
     */
    async getProblemById(id: number): Promise<Problem | null> {
        const query = `
      SELECT * FROM problems WHERE id = $1;
    `;
        const result = await pool.query<Problem>(query, [id]);
        return result.rows[0] || null;
    }

    /**
     * Update a problem
     */
    async updateProblem(
        id: number,
        input: ProblemUpdateInput
    ): Promise<Problem> {
        const { title, description, difficulty, order_index, is_published } = input;

        const query = `
      UPDATE problems SET 
        title = $1,
        description = $2,
        difficulty = $3,
        order_index = $4,
        is_published = $5
      WHERE id = $6
      RETURNING *;
    `;

        const result = await pool.query<Problem>(query, [
            title,
            description,
            difficulty,
            order_index,
            is_published,
            id
        ]);

        return result.rows[0];
    }

    /**
     * Delete a problem
     */
    async deleteProblem(id: number): Promise<void> {
        const query = `
      DELETE FROM problems WHERE id = $1;
    `;
        await pool.query(query, [id]);
    }

    /**
     * Create problem with test cases
     */
    async createProblemWithDetails(input: ProblemWithDetails): Promise<Problem> {
        const { title, description, difficulty, testCases, output_weight, created_by } = input;

        // Determine creator ID
        let creatorId = created_by ? Number(created_by) : null;

        if (!creatorId) {
            const userResult = await pool.query("SELECT id FROM users LIMIT 1");
            if (userResult.rows.length > 0) {
                creatorId = userResult.rows[0].id;
            } else {
                throw new Error("No users found in database to assign as creator");
            }
        }

        // Insert problem
        const problemQuery = `
      INSERT INTO problems (
        title, 
        description, 
        difficulty, 
        order_index, 
        created_by, 
        is_published
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `;

        const problemValues = [title, description, difficulty, 0, creatorId, true];
        const problemResult = await pool.query<Problem>(problemQuery, problemValues);
        const newProblem = problemResult.rows[0];

        // Insert test cases
        if (testCases && Array.isArray(testCases) && testCases.length > 0) {
            const testCaseValues = testCases
                .map((tc: any) => {
                    return `(${newProblem.id}, '${tc.input.replace(/'/g, "''")}', '${tc.output.replace(/'/g, "''")}', ${tc.isHidden || false}, ${output_weight || tc.weight || 0})`;
                })
                .join(",");

            const testCaseQuery = `
        INSERT INTO test_cases (problem_id, input, output, is_hidden, weight)
        VALUES ${testCaseValues}
        RETURNING *;
      `;
            await pool.query(testCaseQuery);
        }

        return newProblem;
    }
}

export const problemService = new ProblemService();
