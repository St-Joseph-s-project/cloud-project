import { Request, Response, RequestHandler } from 'express';
// Import using .js extension for the compiled TypeScript output
import pool from '../models/model.js'; 

/**
 * Controller to handle problem submission using your exact PostgreSQL schema
 */
export const handleProblemSubmission: RequestHandler = async (req, res) => {
    try {
        // 1. EXTRACT: Fields must match your DB exactly
        const { 
            module_id, 
            title,
            description, 
            difficulty, 
            order_index, 
            created_by, 
            is_published 
        } = req.body;

        // 2. VALIDATION: module_id and created_by are NOT NULL in your schema
        if (!title || module_id === undefined || created_by === undefined) {
            res.status(400).json({ 
                success: false,
                error: "Missing mandatory fields! Title, Module ID, and Created By (User ID) are required." 
            });
            return; 
        }

        // 3. STORE: SQL query matching your specific columns
        const query = `
            INSERT INTO problems (
                module_id, 
                title, 
                description, 
                difficulty, 
                order_index, 
                created_by, 
                is_published
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `;

        // Ensure IDs and indices are passed as Numbers for the integer columns
        const values = [
            Number(module_id), 
            title, 
            description || null, 
            difficulty, 
            Number(order_index) || 0, 
            Number(created_by), 
            is_published ?? false
        ];

        // This 'await' works because the function is 'async'
        const result = await pool.query(query, values);
        // 4. RESPONSE: Direct to Frontend
        res.status(201).json({
            success: true,
            message: "Problem successfully stored in PostgreSQL!",
            data: result.rows[0]
        });

    } catch (error: any) {
        // Safe error handling to clear red lines in catch block
        const errorMessage = error instanceof Error ? error.message : "Database connection failed";
        
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            details: errorMessage 
        });
    }
};