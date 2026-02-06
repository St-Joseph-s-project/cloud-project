# Interview Experience (Blogs) API Specification

## Overview
This API provides endpoints for managing interview experience blogs, including creating blogs, voting, commenting, and filtering by tags.

## API Endpoints

### 1. GET /api/blogs — List blogs (paginated, filterable, sortable)

**Description:** Retrieve a paginated list of blogs with optional filtering and sorting

**Query Parameters:**
- `page` (number, default: 1) — Page number
- `limit` (number, default: 6) — Items per page
- `search` (string, optional) — Search in title, description, user_name (case-insensitive)
- `tag_id` (number, optional) — Filter by tag id
- `sort_by` (string, default: "latest") — One of: "latest", "oldest", "most_upvoted"

**Method:** GET

**Authentication:** Optional (includes user vote if authenticated)

**Example Request:**
```bash
GET /api/blogs?page=1&limit=6&search=google&tag_id=1&sort_by=latest
Authorization: Bearer <token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My Google Interview",
      "description": "Full text...",
      "up_vote": 42,
      "down_vote": 3,
      "created_at": "2026-01-28T10:30:00Z",
      "is_deleted": false,
      "user_name": "Alice Johnson",
      "tags": [
        { "id": 1, "name": "Google" },
        { "id": 7, "name": "SDE-2" }
      ],
      "user_vote": "up"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 15,
    "totalPages": 3
  }
}
```

**Notes:**
- Search matches against title, description, and user_name
- Deleted blogs (is_deleted = true) are filtered out
- user_vote is "up", "down", or null (requires authentication)

---

### 2. POST /api/blogs — Create a blog

**Description:** Create a new blog with optional tags

**Method:** POST

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "title": "My Interview Experience",
  "description": "Detailed description...",
  "tags": [1, 3, 7]
}
```

**Fields:**
- `title` (string, required) — Blog title
- `description` (string, optional) — Blog description
- `tags` (number[], optional) — Array of tag IDs

**Example Request:**
```bash
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Amazon SDE Interview",
  "description": "My interview experience at Amazon...",
  "tags": [2, 6, 11]
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "user_id": 99,
    "title": "My Interview Experience",
    "description": "Detailed description...",
    "up_vote": 0,
    "down_vote": 0,
    "created_at": "2026-02-06T10:00:00Z",
    "is_deleted": false,
    "user_name": "Current User",
    "tags": [
      { "id": 1, "name": "Google" },
      { "id": 3, "name": "Microsoft" },
      { "id": 7, "name": "SDE-2" }
    ],
    "user_vote": null
  },
  "message": "Blog created successfully!"
}
```

**Notes:**
- user_id comes from the authenticated token
- Tags array is optional and can be empty

---

### 3. POST /api/blogs/vote — Vote (upvote/downvote) on a blog

**Description:** Vote on a blog with toggle logic

**Method:** POST

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "blog_id": 1,
  "is_up_vote": true
}
```

**Fields:**
- `blog_id` (number, required) — Blog ID to vote on
- `is_up_vote` (boolean, required) — true = upvote, false = downvote

**Example Request:**
```bash
POST /api/blogs/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "blog_id": 1,
  "is_up_vote": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "up_vote": 43,
    "down_vote": 3,
    "user_vote": "up"
  }
}
```

**Vote Toggle Logic:**
| Current Vote | Action (is_up_vote) | Result |
|---|---|---|
| null | true | up_vote++, user_vote = "up" |
| null | false | down_vote++, user_vote = "down" |
| "up" | true | up_vote--, user_vote = null (remove vote) |
| "up" | false | up_vote--, down_vote++, user_vote = "down" |
| "down" | false | down_vote--, user_vote = null (remove vote) |
| "down" | true | down_vote--, up_vote++, user_vote = "up" |

**Notes:**
- user_id comes from the authenticated token
- Implements upsert logic for vote_user_mapping

---

### 4. GET /api/blogs/comments/:blog_id — Get comments for a blog (paginated)

**Description:** Get paginated comments for a specific blog

**Path Parameters:**
- `blog_id` (number, required) — Blog ID

**Query Parameters:**
- `page` (number, default: 1) — Page number
- `limit` (number, default: 5) — Comments per page

**Method:** GET

**Authentication:** Not required

**Example Request:**
```bash
GET /api/blogs/comments/1?page=1&limit=5
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "blog_id": 1,
      "comment": "Great writeup!",
      "created_at": "2026-01-28T12:00:00Z",
      "user_name": "Bob Smith"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 7,
    "totalPages": 2
  }
}
```

**Notes:**
- Comments are sorted by created_at in descending order (newest first)
- User names are joined from the users table

---

### 5. POST /api/blogs/comments — Add a comment

**Description:** Add a comment to a blog

**Method:** POST

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "blog_id": 1,
  "comment": "Great experience, thanks for sharing!"
}
```

**Fields:**
- `blog_id` (number, required) — Blog ID
- `comment` (string, required) — Comment text

**Example Request:**
```bash
POST /api/blogs/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "blog_id": 1,
  "comment": "Great experience, thanks for sharing!"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 30,
    "user_id": 99,
    "blog_id": 1,
    "comment": "Great experience, thanks for sharing!",
    "created_at": "2026-02-06T10:05:00Z",
    "user_name": "Current User"
  },
  "message": "Comment added successfully!"
}
```

**Notes:**
- user_id comes from the authenticated token
- Comment must not be empty

---

### 6. GET /api/tags — Get all tags

**Description:** Retrieve all available tags

**Method:** GET

**Authentication:** Not required

**Query Parameters:** None

**Example Request:**
```bash
GET /api/tags
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Google" },
    { "id": 2, "name": "Amazon" },
    { "id": 3, "name": "Microsoft" },
    { "id": 4, "name": "Meta" },
    { "id": 5, "name": "Apple" },
    { "id": 6, "name": "SDE-1" },
    { "id": 7, "name": "SDE-2" },
    { "id": 8, "name": "Frontend" },
    { "id": 9, "name": "Backend" },
    { "id": 10, "name": "System Design" },
    { "id": 11, "name": "DSA" },
    { "id": 12, "name": "Behavioral" }
  ]
}
```

---

## General Notes

- **Base URL:** `http://localhost:3000/api`
- **Authentication:** Uses Bearer tokens in Authorization header
- **Timestamps:** All timestamps are in ISO 8601 format (UTC)
- **Error Responses:** Follow the format `{ "success": false, "error": "Error description", "details": "Additional details" }`
- **CORS:** Configured to allow requests from `http://localhost:5173`
- **Credentials:** All authenticated requests must include the authorization token

## Database Tables

### blogs
- `id` (INT, PRIMARY KEY)
- `user_id` (INT, FOREIGN KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `up_vote` (INT, default: 0)
- `down_vote` (INT, default: 0)
- `created_at` (TIMESTAMP)
- `is_deleted` (BOOLEAN, default: false)

### comments
- `id` (INT, PRIMARY KEY)
- `user_id` (INT, FOREIGN KEY)
- `blog_id` (INT, FOREIGN KEY)
- `comment` (TEXT)
- `created_at` (TIMESTAMP)

### tags
- `id` (INT, PRIMARY KEY)
- `name` (VARCHAR)

### blog_tags_mapping
- `id` (INT, PRIMARY KEY)
- `blog_id` (INT, FOREIGN KEY)
- `tag_id` (INT, FOREIGN KEY)

### vote_user_mapping
- `id` (INT, PRIMARY KEY)
- `user_id` (INT, FOREIGN KEY)
- `blog_id` (INT, FOREIGN KEY)
- `is_up_vote` (BOOLEAN, default: false)
- `is_down_vote` (BOOLEAN, default: false)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Bad Request",
  "details": "blog_id and is_up_vote are required"
}
```

Common HTTP Status Codes:
- `200` — Successful GET/POST/PUT/DELETE
- `201` — Resource created successfully
- `400` — Bad Request (validation error)
- `401` — Unauthorized (missing or invalid token)
- `403` — Forbidden (invalid token)
- `404` — Not Found
- `500` — Internal Server Error
