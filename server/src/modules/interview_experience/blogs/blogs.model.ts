export interface Blog {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  up_vote: number;
  down_vote: number;
  created_at?: Date;
  is_deleted: boolean;
}

export interface BlogCreateInput {
  title: string;
  description?: string;
  tags?: number[];
}

export interface BlogUpdateInput {
  title?: string;
  description?: string;
  is_deleted?: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface BlogTagMapping {
  id: number;
  blog_id: number;
  tag_id: number;
}

export interface VoteUserMapping {
  id: number;
  user_id: number;
  blog_id: number;
  is_up_vote: boolean;
  is_down_vote: boolean;
}

export interface UserVote {
  is_up_vote: boolean;
  is_down_vote: boolean;
}

export interface BlogWithDetails {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  up_vote: number;
  down_vote: number;
  created_at?: Date;
  is_deleted: boolean;
  user_name: string;
  tags: Tag[];
  user_vote: "up" | "down" | null;
}

export interface VoteResponse {
  up_vote: number;
  down_vote: number;
  user_vote: "up" | "down" | null;
}

export interface Comment {
  id: number;
  user_id: number;
  blog_id: number;
  comment: string;
  created_at?: Date;
  user_name: string;
}

export interface CommentCreateInput {
  blog_id: number;
  comment: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
