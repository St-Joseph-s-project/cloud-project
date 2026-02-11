# Interview Experience API Documentation

## Base URL

```
/api
```

---

## Authentication

All endpoints require JWT token in Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## User Endpoints

### 1. Get All Blogs (Paginated)

**Endpoint:** `GET /blogs`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search in title/description |
| tag_id | number | No | Filter by tag ID |
| sort_by | string | No | `latest` \| `oldest` \| `most_upvoted` (default: `latest`) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "title": "My Amazon Interview Experience",
      "description": "Full interview description...",
      "up_vote": 15,
      "down_vote": 2,
      "created_at": "2026-02-08T10:30:00.000Z",
      "is_deleted": false,
      "user_name": "John Doe",
      "tags": [
        { "id": 1, "name": "Amazon" },
        { "id": 5, "name": "SDE" }
      ],
      "user_vote": "up" | "down" | null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 2. Get Blog by ID

**Endpoint:** `GET /blogs/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Blog ID |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 123,
    "title": "My Amazon Interview Experience",
    "description": "Full interview description...",
    "up_vote": 15,
    "down_vote": 2,
    "created_at": "2026-02-08T10:30:00.000Z",
    "is_deleted": false,
    "user_name": "John Doe",
    "tags": [
      { "id": 1, "name": "Amazon" },
      { "id": 5, "name": "SDE" }
    ],
    "user_vote": "up" | "down" | null
  }
}
```

---

### 3. Create Blog

**Endpoint:** `POST /blogs`

**Request Body:**

```json
{
  "title": "My Google Interview Experience",
  "description": "Detailed description of the interview...",
  "tags": [1, 3, 5] // Array of tag IDs
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "user_id": 123,
    "title": "My Google Interview Experience",
    "description": "Detailed description of the interview...",
    "up_vote": 0,
    "down_vote": 0,
    "created_at": "2026-02-08T12:00:00.000Z",
    "is_deleted": false
  }
}
```

---

### 4. Delete Blog (User's Own)

**Endpoint:** `DELETE /blogs/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Blog ID |

**Note:** User can only delete their own blogs.

**Response:**

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### 5. Vote on Blog

**Endpoint:** `POST /blogs/vote`

**Request Body:**

```json
{
  "blog_id": 1,
  "is_up_vote": true // true for upvote, false for downvote
}
```

**Behavior:**

- If user hasn't voted: adds the vote
- If user clicks same vote type again: removes the vote (toggle off)
- If user clicks opposite vote type: switches the vote

**Response:**

```json
{
  "success": true,
  "data": {
    "up_vote": 16,
    "down_vote": 2,
    "user_vote": "up" | "down" | null
  }
}
```

---

### 6. Get Comments for a Blog (Paginated)

**Endpoint:** `GET /blogs/:id/comments`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Blog ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 5) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 456,
      "blog_id": 1,
      "comment": "Great experience! Thanks for sharing.",
      "created_at": "2026-02-08T11:00:00.000Z",
      "user_name": "Jane Smith"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}
```

---

### 7. Add Comment

**Endpoint:** `POST /blogs/comments`

**Request Body:**

```json
{
  "blog_id": 1,
  "comment": "This is very helpful!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "user_id": 123,
    "blog_id": 1,
    "comment": "This is very helpful!",
    "created_at": "2026-02-08T12:30:00.000Z",
    "user_name": "John Doe"
  }
}
```

---

### 8. Delete Comment

**Endpoint:** `DELETE /blogs/comments/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Comment ID |

**Note:** User can only delete their own comments.

**Response:**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

### 9. Get All Tags

**Endpoint:** `GET /tags`

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Amazon" },
    { "id": 2, "name": "Google" },
    { "id": 3, "name": "Microsoft" },
    { "id": 4, "name": "Meta" },
    { "id": 5, "name": "SDE" },
    { "id": 6, "name": "Data Science" }
  ]
}
```

---

## Admin Endpoints

### 10. Get All Blogs (Admin)

**Endpoint:** `GET /admin/blogs`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search_email | string | No | Search by user email |
| sort_by | string | No | `latest` \| `oldest` (default: `latest`) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "title": "My Amazon Interview Experience",
      "description": "Full interview description...",
      "up_vote": 15,
      "down_vote": 2,
      "created_at": "2026-02-08T10:30:00.000Z",
      "is_deleted": false,
      "user_name": "John Doe",
      "user_email": "john.doe@example.com",
      "tags": [
        { "id": 1, "name": "Amazon" },
        { "id": 5, "name": "SDE" }
      ],
      "user_vote": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Note:** Admin endpoint returns `user_email` field which is not available in regular user endpoint.

---

### 11. Delete Blog (Admin)

**Endpoint:** `DELETE /admin/blogs/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Blog ID |

**Note:** Admin can delete any blog regardless of ownership.

**Response:**

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### 12. Delete Comment (Admin)

**Endpoint:** `DELETE /admin/comments/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Comment ID |

**Note:** Admin can delete any comment regardless of ownership.

**Response:**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## Database Schema Reference

```sql
-- Blogs table
blogs (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  up_vote     INT DEFAULT 0,
  down_vote   INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted  BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
)

-- Vote tracking
vote_user_mapping (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  blog_id     INT NOT NULL,
  is_up_vote  BOOLEAN DEFAULT FALSE,
  is_down_vote BOOLEAN DEFAULT FALSE,
  UNIQUE KEY (user_id, blog_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (blog_id) REFERENCES blogs(id)
)

-- Tags
tags (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE
)

-- Blog-Tag relationship
blog_tags_mapping (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  blog_id INT NOT NULL,
  tag_id  INT NOT NULL,
  UNIQUE KEY (blog_id, tag_id),
  FOREIGN KEY (blog_id) REFERENCES blogs(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
)

-- Comments
comments (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL,
  blog_id    INT NOT NULL,
  comment    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (blog_id) REFERENCES blogs(id)
)
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP status codes:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Internal Server Error
