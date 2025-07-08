# Role-Based Access Control (RBAC) System

## Overview

This Payload CMS instance implements a comprehensive role-based access control system with four distinct user roles, each with specific permissions for content management.

## User Roles

### 1. Super Admin (`admin`)
**Full system access with all permissions**

#### User Management:
- ✅ Create new users
- ✅ Delete users
- ✅ Update any user profile
- ✅ Change user roles
- ✅ Access all user data

#### Blog Content:
- ✅ Create blog posts
- ✅ Edit any blog post
- ✅ Delete any blog post
- ✅ Change publication status
- ✅ Assign/change blog authors
- ✅ Mark posts as featured
- ✅ Manage all blog metadata

#### Media Management:
- ✅ Upload media files
- ✅ Delete media files
- ✅ Edit media metadata

### 2. Editor (`editor`)
**Content oversight and management permissions**

#### User Management:
- ❌ Cannot create users
- ❌ Cannot delete users
- ✅ View user information
- ✅ Update own profile only

#### Blog Content:
- ✅ Create blog posts
- ✅ Edit any blog post
- ✅ Delete any blog post
- ✅ Change publication status (draft → published)
- ✅ Assign/change blog authors
- ✅ Mark posts as featured
- ✅ Review and approve author submissions

#### Media Management:
- ✅ Upload media files
- ✅ Delete media files
- ✅ Edit media metadata

### 3. Author (`author`)
**Content creation permissions**

#### User Management:
- ❌ Cannot create users
- ❌ Cannot delete users
- ✅ View basic user information
- ✅ Update own profile only

#### Blog Content:
- ✅ Create blog posts
- ✅ Edit own blog posts only
- ❌ Cannot delete blog posts
- ❌ Cannot change publication status
- ❌ Cannot change author assignment
- ❌ Cannot mark posts as featured
- ✅ Submit posts for review

#### Media Management:
- ✅ Upload media files
- ❌ Cannot delete media files
- ✅ Edit own media metadata

### 4. Viewer (`viewer`)
**Read-only access**

#### User Management:
- ❌ Cannot create users
- ❌ Cannot delete users
- ✅ View basic user information
- ✅ Update own profile only

#### Blog Content:
- ❌ Cannot create blog posts
- ❌ Cannot edit blog posts
- ❌ Cannot delete blog posts
- ❌ Cannot change publication status
- ✅ View published content (same as public)

#### Media Management:
- ❌ Cannot upload media files
- ❌ Cannot delete media files
- ❌ Cannot edit media metadata

## Content Workflow

### Blog Post States

1. **Draft** - Initial state for new posts
2. **In Review** - Authors submit for editor approval
3. **Published** - Live on the website
4. **Archived** - Removed from public view but retained

### Workflow Process

1. **Authors** create blog posts in "Draft" status
2. **Authors** change status to "In Review" when ready
3. **Editors** review and either:
   - Approve and change to "Published"
   - Send back to "Draft" with feedback
4. **Editors/Admins** can archive posts when needed

## Field-Level Permissions

### Author Field
- **Visible to**: Admins and Editors only
- **Auto-populated**: With current user when creating
- **Editable by**: Admins and Editors only

### Status Field
- **Editable by**: Editors and Admins only
- **Authors**: Can only set to "Draft" or "In Review"

### Featured Flag
- **Visible to**: Editors and Admins only
- **Purpose**: Highlight important posts on frontend

### Tags
- **Editable by**: All content creators
- **Purpose**: Categorization and search functionality

## Security Features

### User Account Security
- **Active Status**: Admins can deactivate accounts
- **Self-Update**: Users can only edit their own profiles
- **Role Protection**: Only admins can change user roles

### Content Security
- **Author Restriction**: Authors can only edit their own content
- **Publication Control**: Only editors+ can publish content
- **Deletion Control**: Only editors+ can delete content

## API Access

### Public Endpoints (No Authentication)
- `GET /api/blogs` - Published blogs only
- `GET /api/media` - Public media files

### Authenticated Endpoints
- All CRUD operations respect role permissions
- User context determines available actions

## Best Practices

### For Admins
1. Regularly review user accounts and roles
2. Monitor content publication workflow
3. Maintain media library organization

### For Editors
1. Review author submissions promptly
2. Maintain content quality standards
3. Coordinate with authors on feedback

### For Authors
1. Follow content guidelines
2. Submit complete drafts for review
3. Respond to editor feedback promptly

### For All Users
1. Keep profile information current
2. Use descriptive titles and metadata
3. Follow tagging conventions

## Implementation Notes

- Roles are hierarchical (Admin > Editor > Author > Viewer)
- Access control is enforced at both API and UI levels
- Role changes require admin privileges
- Content ownership is tracked via author relationships 