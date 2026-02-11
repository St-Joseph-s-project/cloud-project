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

export interface BlogFile {
  id: number;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_mime_type?: string;
  created_at?: Date;
}

export interface BlogCreateInput {
  title: string;
  description?: string;
  tags?: number[];
  files?: BlogFile[];
}

export interface BlogUpdateInput {
  title?: string;
  description?: string;
  is_deleted?: boolean;
  tags?: number[];
  files?: BlogFile[];
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

export interface Reaction {
  id: number;
  reaction: string;
}

export interface ReactionResponse {
  reaction_id: number;
  count: number;
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
  files?: BlogFile[];
  user_vote: "up" | "down" | null;
  user_reaction: number | null;
  reactions: ReactionResponse[];
  comment_count?: number;
}

export interface BlogWithDetailsAdmin extends BlogWithDetails {
  user_email: string;
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
  user_reaction: number | null;
  reactions: ReactionResponse[];
}

export interface CommentCreateInput {
  blog_id: number;
  comment: string;
}

export interface CommentUpdateInput {
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
