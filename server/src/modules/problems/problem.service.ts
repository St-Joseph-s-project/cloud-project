import prisma from "../../lib/prisma.ts";
import type {
  Problem,
  ProblemCreateInput,
  ProblemUpdateInput,
  ProblemWithDetails,
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
    const normalizedDifficulty = difficulty?.trim().toUpperCase();

    const problem = await prisma.problem.create({
      data: {
        title,
        description: description || null,
        difficulty: (normalizedDifficulty as any) || "EASY",
        order_index: 0,
        created_by: Number(created_by),
        is_published: is_published ?? false,
      },
    });

    return problem as Problem;
  }

  /**
   * Get all problems
   */
  async getAllProblems(): Promise<Problem[]> {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        module_id: true,
        difficulty: true,
        order_index: true,
        is_published: true,
      },
    });

    return problems as Problem[];
  }

  /**
   * Get problem by ID
   */
  async getProblemById(id: number): Promise<Problem | null> {
    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    return problem as Problem | null;
  }

  /**
   * Update a problem
   */
  async updateProblem(id: number, input: ProblemUpdateInput): Promise<Problem> {
    const { title, description, difficulty, order_index, is_published } = input;

    const problem = await prisma.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty: difficulty as any,
        order_index,
        is_published,
      },
    });

    return problem as Problem;
  }

  /**
   * Delete a problem
   */
  async deleteProblem(id: number): Promise<void> {
    await prisma.problem.delete({
      where: { id },
    });
  }

  /**
   * Create problem with test cases
   */
  async createProblemWithDetails(input: ProblemWithDetails): Promise<Problem> {
    const {
      title,
      description,
      difficulty,
      testCases,
      output_weight,
      created_by,
    } = input;

    // Determine creator ID
    let creatorId = created_by ? Number(created_by) : null;

    if (!creatorId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        creatorId = firstUser.id;
      } else {
        throw new Error("No users found in database to assign as creator");
      }
    }

    // Create problem with test cases in a transaction
    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty: (difficulty as any) || "EASY",
        order_index: 0,
        created_by: creatorId,
        is_published: true,
        testCases: {
          create:
            testCases?.map((tc: any) => ({
              input: tc.input,
              output: tc.output,
            })) || [],
        },
      },
      include: {
        testCases: true,
      },
    });

    return newProblem as Problem;
  }
}

export const problemService = new ProblemService();
