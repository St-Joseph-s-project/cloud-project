export interface Problem {
    id: number;
    title: string;
    description?: string;
    module_id?: number;
    difficulty?: string;
    order_index: number;
    created_by: number;
    is_published: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface ProblemCreateInput {
    title: string;
    description?: string;
    difficulty?: string;
    created_by: number;
    is_published?: boolean;
}

export interface ProblemUpdateInput {
    title?: string;
    description?: string;
    difficulty?: string;
    order_index?: number;
    is_published?: boolean;
}

export interface ProblemWithDetails extends ProblemCreateInput {
    testCases?: TestCase[];
    output_weight?: number;
}

export interface TestCase {
    input: string;
    output: string;
    isHidden?: boolean;
    weight?: number;
}
