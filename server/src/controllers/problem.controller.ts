import type { Request, Response, RequestHandler } from "express";
// Import using .js extension for the compiled TypeScript output
import pool from "../models/model.ts";

/**
 * Controller to handle problem submission using your exact PostgreSQL schema
 */
export const handleProblemSubmission: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // 1. EXTRACT: Fields must match your DB exactly
    const { title, description, difficulty, created_by, is_published } =
      req.body;

    // 2. VALIDATION: created_by are NOT NULL in your schema
    if (!title || created_by === undefined) {
      res.status(400).json({
        success: false,
        error:
          "Missing mandatory fields! Title and Created By (User ID) are required.",
      });
      return;
    }

    // 3. STORE: SQL query matching your specific columns
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

    // Ensure IDs and indices are passed as Numbers for the integer columns
    const values = [
      title,
      description || null,
      difficulty,
      0,
      Number(created_by),
      is_published ?? false,
    ];

    // This 'await' works because the function is 'async'
    const result = await pool.query(query, values);
    // 4. RESPONSE: Direct to Frontend
    res.status(201).json({
      success: true,
      message: "Problem successfully stored in PostgreSQL!",
      data: result.rows[0],
    });
  } catch (error: any) {
    // Safe error handling to clear red lines in catch block
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: errorMessage,
    });
  }
};

export const getAllProblems: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const query = `
            SELECT id, title, module_id, difficulty, order_index, is_published FROM problems;
        `;
    const result = await pool.query(query);
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: errorMessage,
    });
  }
};

export const getProblemById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const query = `
            SELECT * FROM problems WHERE id = $1;
        `;
    const result = await pool.query(query, [req.params.id]);
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: errorMessage,
    });
  }
};

export const updateProblem: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { title, description, difficulty, order_index, is_published } =
    req.body;

  try {
    const query = `
            UPDATE problems SET 
            title = $1,
            description = $2,
            difficulty = $3,
            order_index = $4,
            is_published = $5
            WHERE id = $6;
        `;
    const result = await pool.query(query, [
      title,
      description,
      difficulty,
      order_index,
      is_published,
      req.params.id,
    ]);
    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: errorMessage,
    });
  }
};

export const deleteProblem: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const query = `
            DELETE FROM problems WHERE id = $1;
        `;
    const result = await pool.query(query, [req.params.id]);
    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Database connection failed";
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: errorMessage,
    });
  }
};

export const createProblemWithDetails: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      title,
      description,
      difficulty,
      testCases,
      output_weight,
      created_by,
    } = req.body;

    // ... existing code ...

    // Insert Problem
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
    // Mocking created_by as 1 for admin if not provided
    let creatorId = created_by ? Number(created_by) : null;

    if (!creatorId) {
      // Fallback: Fetch the first available user (ideally an admin)
      const userResult = await pool.query("SELECT id FROM users LIMIT 1");
      if (userResult.rows.length > 0) {
        creatorId = userResult.rows[0].id;
      } else {
        // If no users exist at all, we can't create a problem due to FK constraint
        res.status(400).json({
          success: false,
          error: "No users found in database to assign as creator.",
        });
        return;
      }
    }

    const problemValues = [title, description, difficulty, 0, creatorId, true];

    const problemResult = await pool.query(problemQuery, problemValues);
    const newProblem = problemResult.rows[0];

    // 3. Insert Test Cases
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

    res.status(201).json({
      success: true,
      message: "Problem and test cases created successfully",
      data: newProblem,
    });
  } catch (error: any) {
    console.error("Error creating problem with details:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
