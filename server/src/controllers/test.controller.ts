import type { Request, Response, RequestHandler } from 'express';
import pool from '../config/db.ts';

export const createTest: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { name, batch_id,  college_id, start_time, end_time, created_by } = req.body;
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
        const result = await pool.query(query, [name, batch_id, college_id, start_time, end_time, created_by]);
        res.status(201).json({
            success: true,
            message: "Test created successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: errorMessage
        });
    }
}

export const updateTestStatus: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const query = `
            UPDATE tests SET 
            status = $1
            WHERE id = $2;
        `;
        const result = await pool.query(query, [status, req.params.id]);
        res.status(200).json({
            success: true,
            message: "Test status updated successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: errorMessage
        });
    }
}

export const mapProblemsToTest: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { test_id, problem_id } = req.body;
        const query = `
            INSERT INTO test_problems (test_id, problem_id) 
            VALUES ($1, $2);
        `;
        const result = await pool.query(query, [test_id, problem_id]);
        res.status(201).json({
            success: true,
            message: "Problems mapped to test successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: errorMessage
        });
    }
}

export const getAllTests: RequestHandler = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT * FROM tests;
        `;
        const result = await pool.query(query);
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: errorMessage
        });
    }
}

export const getTestById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT * FROM tests WHERE id = $1;
        `;
        const result = await pool.query(query, [req.params.id]);
        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: errorMessage
        });
    }
}

export const updateTest: RequestHandler = async (req: Request, res: Response) => {
    const { name, batch_id, college_id, start_time, end_time, status, created_by } = req.body;
    try {
        const query = `
            UPDATE tests SET 
            name = $1,
            batch_id = $2,
            college_id = $3,
            start_time = $4,
            end_time = $5,
            status = $6,
            created_by = $7
            WHERE id = $8;
        `;
        const result = await pool.query(query, [name, batch_id, college_id, start_time, end_time, status, created_by, req.params.id]);
        res.status(200).json({
            success: true,
            message: "Test updated successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: errorMessage
        });
    }
}

export const deleteTest: RequestHandler = async (req: Request, res: Response) => {
    try {
        const query = `
            DELETE FROM tests WHERE id = $1;
        `;
        const result = await pool.query(query, [req.params.id]);
        res.status(200).json({
            success: true,
            message: "Test deleted successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: errorMessage
        });
    }
}
