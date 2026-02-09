export interface Tag {
  id: number;
  name: string;
}

export interface BlogType {
  id: number;
  user_id: number;
  title: string;
  description: string;
  up_vote: number;
  down_vote: number;
  created_at: string;
  is_deleted: boolean;
  user_name: string;
  tags: Tag[];
  user_vote?: "up" | "down" | null;
}

export interface CommentType {
  id: number;
  user_id: number;
  blog_id: number;
  comment: string;
  created_at: string;
  user_name: string;
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

export interface GetAllBlogsResponse extends PaginatedResponse<BlogType> {}

export interface GetCommentsResponse extends PaginatedResponse<CommentType> {}

export interface AddBlogPayload {
  title: string;
  description: string;
  tags: number[];
}

export interface AddCommentPayload {
  blog_id: number;
  comment: string;
}

export interface VotePayload {
  blog_id: number;
  is_up_vote: boolean;
}

// Admin types
export interface AdminBlogType extends BlogType {
  user_email: string;
}

export interface GetAdminBlogsResponse extends PaginatedResponse<AdminBlogType> {}