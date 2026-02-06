# Copilot Instructions — Interview Experience Page

## Current Focus
Working on the **Interview Experience** blog feature under `src/students/pages/InterviewExperiance.tsx` and its components in `src/students/components/interviewExperiance/`.

## Tech Stack
- **React 18** with TypeScript
- **Tailwind CSS v4** (utility-first, no component library)
- **Redux Toolkit** for global state (`src/redux/`)
- **Axios** for HTTP (`src/utils/axios.ts`)
- **react-hot-toast** for notifications
- **react-router-dom v6** for routing
- **Vite** as build tool

## Project Structure (relevant)
```
src/
  students/
    pages/
      InterviewExperiance.tsx        ← Main blog listing page
    components/
      interviewExperiance/
        AddBlogModel.tsx             ← Modal to create a new blog
        BlogModel.tsx                ← Modal to view a blog + comments
      PageHeader.tsx                 ← Reusable page header
  types/
    pages/
      interviewExperiance/
        apiTypes.ts                  ← All types for this feature
  data/
    mockBlogData.ts                  ← Mock API (used while backend is not ready)
  utils/
    axios.ts                        ← Axios instance + real API functions
```

## Database Schema (backend reference)
```sql
blogs        → id, user_id, title, description, up_vote, down_vote, created_at, is_deleted
vote_user_mapping → id, user_id, blog_id, is_up_vote, is_down_vote
tags         → id, name
blog_tags_mapping → id, blog_id, tag_id
comments     → id, user_id, blog_id, comment, created_at
```

## Key Types (from apiTypes.ts)
- `BlogType` — id, user_id, title, description, up_vote, down_vote, created_at, is_deleted, user_name, tags: Tag[], user_vote?: "up" | "down" | null
- `CommentType` — id, user_id, blog_id, comment, created_at, user_name
- `Tag` — id, name
- `PaginatedResponse<T>` — success, data: T[], pagination: { page, limit, total, totalPages }
- `AddBlogPayload` — title, description, tags: number[]
- `AddCommentPayload` — blog_id, comment
- `VotePayload` — blog_id, is_up_vote

## Mock Data (backend not ready)
Currently using mock APIs from `src/data/mockBlogData.ts`. Imports are aliased:
```ts
import { mockBlogsAPI as blogsAPI, mockTagsAPI as tagsAPI } from "../../data/mockBlogData";
```
When the backend is ready, switch imports back to `../../utils/axios`.

Real API endpoints (for reference):
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/blogs?page=&limit=&search=&tag_id=&sort_by=` | List blogs (paginated) |
| POST | `/api/blogs` | Create blog |
| POST | `/api/blogs/vote` | Vote on blog |
| GET | `/api/blogs/:id/comments?page=&limit=` | Get comments (paginated) |
| POST | `/api/blogs/comments` | Add comment |
| GET | `/api/tags` | Get all tags |

## Coding Conventions
- Use **functional components** with hooks (no class components)
- Use `React.FC<Props>` for typed components
- Tailwind classes only — no inline styles, no CSS modules
- Use `toast.success()` / `toast.error()` from `react-hot-toast` for user feedback
- Modals use fixed overlay with `bg-black/40 backdrop-blur-sm` pattern
- All API responses follow `{ success: boolean, data: ... }` or `PaginatedResponse<T>`
- Pagination is server-side (page + limit params)
- Search is debounced (400ms)
- Keep component code in its own file; modals/sub-components go under `components/interviewExperiance/`
- Use `PageHeader` component for page titles
