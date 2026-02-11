import prisma from "../../lib/prisma.ts";
import type {
  Test,
  TestCreateInput,
  TestUpdateInput,
  TestProblemMapping,
} from "./test.model.ts";

export class TestService {
  /**
   * Create a new test
   */
  async createTest(input: TestCreateInput): Promise<Test> {
    const { name, batch_id, college_id, start_time, end_time, created_by } =
      input;

    const test = await prisma.test.create({
      data: {
        name,
        batch_id: batch_id!,
        college_id: college_id!,
        start_time,
        end_time,
        created_by,
      },
    });

    return test as Test;
  }

  /**
   * Get all tests
   */
  async getAllTests(): Promise<Test[]> {
    const tests = await prisma.test.findMany();
    return tests as Test[];
  }

  /**
   * Get test by ID
   */
  async getTestById(id: number): Promise<Test | null> {
    const test = await prisma.test.findUnique({
      where: { id },
    });
    return test as Test | null;
  }

  /**
   * Update a test
   */
  async updateTest(id: number, input: TestUpdateInput): Promise<Test> {
    const {
      name,
      batch_id,
      college_id,
      start_time,
      end_time,
      status,
      created_by,
    } = input;

    const test = await prisma.test.update({
      where: { id },
      data: {
        name,
        batch_id,
        college_id,
        start_time,
        end_time,
        status: status as any,
        created_by,
      },
    });

    return test as Test;
  }

  /**
   * Update test status
   */
  async updateTestStatus(id: number, status: string): Promise<Test> {
    const test = await prisma.test.update({
      where: { id },
      data: {
        status: status as any,
      },
    });

    return test as Test;
  }

  /**
   * Delete a test
   */
  async deleteTest(id: number): Promise<void> {
    await prisma.test.delete({
      where: { id },
    });
  }

  /**
   * Map problems to a test
   */
  async mapProblemsToTest(mapping: TestProblemMapping): Promise<void> {
    const { test_id, problem_id } = mapping;

    await prisma.testProblem.create({
      data: {
        test_id,
        problem_id,
      },
    });
  }
}

export const testService = new TestService();
