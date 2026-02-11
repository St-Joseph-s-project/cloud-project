# Backend Implementation Summary

## Overview
All backend changes have been successfully implemented to support:
1. **Reactions System** - Users can react to blogs and comments (Like feature)
2. **File Upload** - Mentors can upload files with blogs/comments using permission checks
3. **Edit Functionality** - Users can edit their own blogs and comments
4. **Permission Middleware** - Checks `post_community_allow_upload_files` permission and sets `can_upload` on req.user

---

## Database Schema Updates
The following tables have been added to your Prisma schema:
- `blog_files` - Stores file metadata for blogs
- `blog_reactions` - Tracks reactions to blogs
- `comment_reactions` - Tracks reactions to comments
- `reactions` - Lookup table for reaction types (reaction_id=1 is Like)

---

## Backend Changes Made

### 1. **New Middleware: Upload Permission**
**File:** `server/src/modules/interview_experience/middlewares/uploadPermission.middleware.ts`

Checks if user has `post_community_allow_upload_files` permission and sets `req.user.can_upload`:
```typescript
// Usage in routes:
router.post("/", authMiddleware, uploadPermissionMiddleware, upload.array("files", 5), createBlog);
```

**Behavior:**
- Queries `role_permissions` table for the user's role
- Sets `req.user.can_upload = true` if permission exists
- Sets `req.user.can_upload = false` otherwise (silently, non-blocking)

---

### 2. **Reactions System**

#### Reaction Service
**File:** `server/src/modules/interview_experience/reactions/reactions.service.ts`

Methods:
- `addBlogReaction(blog_id, user_id, reaction_id)` - Add reaction to blog
- `removeBlogReaction(blog_id, user_id, reaction_id)` - Remove reaction from blog
- `getBlogReactions(blog_id, user_id?)` - Get all reactions with counts for a blog
- `addCommentReaction(comment_id, user_id, reaction_id)` - Add reaction to comment
- `removeCommentReaction(comment_id, user_id, reaction_id)` - Remove reaction from comment
- `getCommentReactions(comment_id, user_id?)` - Get all reactions with counts for a comment

#### Reaction Controller
**File:** `server/src/modules/interview_experience/reactions/reactions.controller.ts`

All endpoints require authentication via `authMiddleware`.

#### Reaction Routes
**File:** `server/src/modules/interview_experience/reactions/reactions.routes.ts`

**Endpoints:**
```
GET  /api/reactions/blog/:blog_id              - Get blog reactions (public)
POST /api/reactions/blog/add                   - Add blog reaction (auth)
POST /api/reactions/blog/remove                - Remove blog reaction (auth)
GET  /api/reactions/comment/:comment_id        - Get comment reactions (public)
POST /api/reactions/comment/add                - Add comment reaction (auth)
POST /api/reactions/comment/remove             - Remove comment reaction (auth)
```

**Response Format for Reactions:**
```json
[
  {
    "reaction_id": 1,
    "reaction_name": "Like",
    "count": 5,
    "user_reacted": true
  }
]
```

---

### 3. **Blog Service Changes**

#### Enhanced Methods
**File:** `server/src/modules/interview_experience/blogs/blog.service.ts`

**`createBlog(input, userId)`** - Now handles files
- Accepts `files` in input payload
- Stores file metadata in `blog_files` table
- Returns `files` array in response

**`updateBlog(id, input, userId)`** - Now with authorization and file handling
- Validates user owns the blog
- Accepts optional `files` to add/update
- Uses upsert for file handling

**`getBlogById(id, userId?)`** - Now includes files
- Returns `files` array with blog details

**`getBlogs(page, limit, search, tag_id, sort_by, userId)`** - Now includes files
- Returns paginated results with files in each blog

**`getAdminBlogs(...)`** - Now includes files
- Admin endpoint includes files in response

---

### 4. **Blog Controller Changes**

**File:** `server/src/modules/interview_experience/blogs/blog.controller.ts`

**`createBlog` handler:**
- Checks `req.user.can_upload` permission
- Processes multer files if permission granted
- Converts files to proper format with URLs
- Passes files to service

**`updateBlog` handler:**
- Similar file handling as createBlog
- Passes userId for ownership validation

**File URL Construction:**
```
${req.protocol}://${req.get("host")}/uploads/${file.filename}
```

---

### 5. **Blog Routes Changes**

**File:** `server/src/modules/interview_experience/blogs/blog.routes.ts`

```typescript
// File upload middleware added to POST and PUT
router.post("/", authMiddleware, uploadPermissionMiddleware, upload.array("files", 5), createBlog);
router.put("/:id", authMiddleware, uploadPermissionMiddleware, upload.array("files", 5), updateBlog);
```

---

### 6. **Comments Service - Edit Support**

**File:** `server/src/modules/interview_experience/comments/comments.service.ts`

**New Methods:**
- `updateComment(comment_id, input, userId)` - Update comment (user can only update their own)
  - Validates comment text is not empty
  - Validates user owns the comment
  - Returns updated comment

---

### 7. **Comments Controller - Edit Support**

**File:** `server/src/modules/interview_experience/comments/comments.controller.ts`

**New Handler:**
- `updateComment` - PUT endpoint handler

---

### 8. **Comments Routes - Edit Support**

**File:** `server/src/modules/interview_experience/comments/comments.routes.ts`

```typescript
router.put("/:id", authMiddleware, updateComment);
```

**New Endpoint:**
```
PUT /api/blogs/comments/:id  - Update comment (auth, user's own only)
```

---

### 9. **Blog Models - Type Updates**

**File:** `server/src/modules/interview_experience/blogs/blogs.model.ts`

**New Interfaces:**
- `BlogFile` - File metadata structure
- `ReactionCount` - Reaction count structure (not in types, in service)

**Updated Interfaces:**
- `BlogCreateInput` - Now accepts `files?: BlogFile[]`
- `BlogUpdateInput` - Now accepts `files?: BlogFile[]`
- `BlogWithDetails` - Now includes `files?: BlogFile[]`
- `CommentUpdateInput` - New interface for comment updates

---

### 10. **App Routes Registration**

**File:** `server/src/app.ts`

Added reactions routes:
```typescript
import reactionRoutes from "./modules/interview_experience/reactions/reactions.routes.ts";
app.use("/api/reactions", reactionRoutes);
```

---

## Permission System

### Permission Storage
The permission check uses the existing `role_permissions` table:
- Permission name: `post_community_allow_upload_files`
- Maps roles (1=Admin, 2=Mentor, 3=Student) to permissions

### Adding Permissions
To grant upload permission to mentors, insert into database:
```sql
INSERT INTO role_permissions (role, permission)
SELECT 2, id FROM permissions WHERE permission = 'post_community_allow_upload_files';
```

### Frontend Integration
The `req.user.can_upload` attribute is passed in the response and should be used to:
- Show upload UI only if `can_upload === true`
- Disable file inputs if user doesn't have permission

---

## API Response Examples

### Create Blog with Files
**Request:**
```
POST /api/blogs
Content-Type: multipart/form-data

title=My Interview
description=Great experience
tags=[1, 2]
files=<file1>, <file2>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My Interview",
    "description": "Great experience",
    "files": [
      {
        "id": 1,
        "file_url": "http://localhost:3000/uploads/file1.pdf",
        "file_name": "Resume.pdf",
        "file_size": 102400,
        "file_mime_type": "application/pdf"
      }
    ]
  }
}
```

### Get Blog Reactions
**Request:** `GET /api/reactions/blog/1`

**Response:**
```json
[
  {
    "reaction_id": 1,
    "reaction_name": "Like",
    "count": 5,
    "user_reacted": true
  }
]
```

### Add Blog Reaction
**Request:**
```json
POST /api/reactions/blog/add
{
  "blog_id": 1,
  "reaction_id": 1
}
```

### Update Comment
**Request:**
```json
PUT /api/blogs/comments/5
{
  "comment": "Updated comment text"
}
```

---

## Error Handling

### Responses
- **400 Bad Request** - Missing required fields or invalid input
- **401 Unauthorized** - No token or invalid token
- **403 Forbidden** - User trying to edit/delete another user's content
- **404 Not Found** - Blog, comment, or reaction not found
- **409 Conflict** - User already reacted with this reaction

---

## Testing Checklist

### Backend
- [ ] Reactions API endpoints return correct response format
- [ ] Cannot add duplicate reactions from same user
- [ ] Removing non-existent reactions returns 404
- [ ] Upload permission middleware correctly sets `can_upload`
- [ ] Files are stored in `blog_files` table
- [ ] File URLs are correct in responses
- [ ] Users can edit their own blogs
- [ ] Users cannot edit other users' blogs
- [ ] Users can edit their own comments
- [ ] Users cannot edit other users' comments
- [ ] Comment update preserves comment_id and blog_id

### Frontend (To be implemented)
- [ ] Show reaction button with count on blog cards
- [ ] Show edit button on blogs/comments user created
- [ ] File upload UI shown only if `can_upload === true`
- [ ] Moving vote buttons from modal to blog card
- [ ] Edit modal for blogs/comments
- [ ] Optimistic UI updates for reactions

---

## Files Modified/Created

### New Files
- `server/src/modules/interview_experience/middlewares/uploadPermission.middleware.ts`
- `server/src/modules/interview_experience/reactions/reactions.service.ts`
- `server/src/modules/interview_experience/reactions/reactions.controller.ts`
- `server/src/modules/interview_experience/reactions/reactions.routes.ts`

### Modified Files
- `server/src/app.ts` - Added reactions routes
- `server/src/modules/interview_experience/blogs/blogs.model.ts` - Updated types
- `server/src/modules/interview_experience/blogs/blog.service.ts` - Updated methods for files
- `server/src/modules/interview_experience/blogs/blog.controller.ts` - File handling
- `server/src/modules/interview_experience/blogs/blog.routes.ts` - Added middleware
- `server/src/modules/interview_experience/comments/comments.service.ts` - Added update method
- `server/src/modules/interview_experience/comments/comments.controller.ts` - Added update handler
- `server/src/modules/interview_experience/comments/comments.routes.ts` - Added update route
- `client/src/types/pages/interviewExperiance/apiTypes.ts` - Updated types
- `client/src/utils/axios.ts` - Added reactions API and update methods

---

## Frontend Implementation Tasks

The following frontend updates still need to be implemented:

### 1. Update Blog Card Component
- [ ] Add reaction button before upvote button
- [ ] Show reaction count
- [ ] Add edit button for user's own blogs
- [ ] Move voting to blog card (not in modal)
- [ ] Show edit pencil icon on hover

### 2. Update Blog Modal Component
- [ ] Add file display section
- [ ] Remove voting section (moved to card)
- [ ] Add edit mode for blogs
- [ ] Make comments section always available
- [ ] Add edit/delete buttons for comments

### 3. Update Add Blog Modal
- [ ] Add file upload input
- [ ] Only show if `can_upload === true`
- [ ] Support FormData for multipart request
- [ ] Show file list before submission

### 4. Update Blog List View
- [ ] Show reaction counts on cards
- [ ] Move voting buttons to card
- [ ] Show edit icon for user's blogs

### 5. Add File Display Component
- [ ] Show files as downloadable links
- [ ] Display file type icon
- [ ] Show file size in human-readable format

### 6. Add Reaction UI Component
- [ ] Like button with count
- [ ] Toggle on click
- [ ] Optimistic UI updates
- [ ] Handle API errors gracefully

---

## Notes

- The `reactions` table should have a record with `id=1, reaction="Like"` for the like feature
- Files are stored in the `uploads` directory and served statically
- The permission `post_community_allow_upload_files` must exist in the `permissions` table
- The `can_upload` attribute is set even if falsey (not filtered from response)
- All timestamps are in UTC format from the database
- File uploads are limited to 5 files per request (configurable in routes via `upload.array("files", 5)`)

