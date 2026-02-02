import { Request, Response, RequestHandler } from 'express';
// Import the pool from your model file
import pool from '../models/model.ts'; 

/**
 * Controller to handle problem submission using PostgreSQL
 */
export const handleProblemSubmission: RequestHandler = async (req, res) => {
    try {
        // 1. EXTRACT: Getting all 9 fields from the request body
        const { 
            title, 
            category, 
            description, 
            sampleTestCases, 
            hiddenCases, 
            role, 
            is_successful, 
            code, 
            language 
        } = req.body;

        // 2. VALIDATION
        if (!title || !code || !language) {
            res.status(400).json({ 
                success: false,
                error: "Missing fields! Title, Code, and Language are mandatory." 
            });
            return;
        }

        // 3. ROLE CHECK
        const authorizedRoles = ['admin', 'super admin'];
        const userRole = role?.toLowerCase();
        if (!userRole || !authorizedRoles.includes(userRole)) {
            res.status(403).json({ 
                success: false,
                error: "Unauthorized: Only admins can submit problems." 
            });
            return;
        }

        // 4. STORE: SQL INSERT Query for PostgreSQL
        // Note: PostgreSQL requires arrays to be handled carefully. 
        // We use JSON.stringify for test cases if your DB columns are JSONB, 
        // or pass them as arrays if the columns are defined as such.
        const query = `
            INSERT INTO problems (
                title, category, description, sample_test_cases, 
                hidden_cases, creator_role, is_successful, code, language
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *;
        `;

        const values = [
            title,
            category,
            description,
            JSON.stringify(sampleTestCases), // Storing as JSON string for JSONB columns
            JSON.stringify(hiddenCases),     // Storing as JSON string for JSONB columns
            role,
            is_successful,
            code,
            language
        ];

        const result = await pool.query(query, values);
        const newProblem = result.rows[0];

        // 5. SEND: Success response back to React
        res.status(201).json({
            success: true,
            message: "Problem successfully submitted and stored in PostgreSQL!",
            problem: newProblem
        });

    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        
        res.status(500).json({ 
            success: false,
            error: "Internal Server Error", 
            details: errorMessage 
        });
    }
};