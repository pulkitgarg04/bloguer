# Changelog
All notable changes to this project will be documented in this file.

---

## [3.0.0] - 2025-10-26

### Added
- **Email Verification System**: Complete email verification flow for new user signups
  - 24-hour verification token expiry
  - Resend verification email functionality
  - Auto-verification for Google OAuth users
  - Email verification enforcement for credential-based login
- **Password Reset Flow**: Complete forgot password and reset password functionality
  - Secure token generation using crypto.randomBytes
  - 1-hour reset token expiry
  - Email-based password reset with Nodemailer
  - Frontend pages for forgot password and reset password
- **Validation Library**: Published `@pulkitgarg04/bloguer-validations@2.0.0` npm package
  - Comprehensive Zod validation schemas for all inputs
  - Email regex validation
  - Username validation (3-20 chars, alphanumeric with underscore/hyphen)
  - Strong password requirements (8-128 chars with uppercase, lowercase, number, special character)
  - Token validation (64-character hex format)
  - Blog post validation (title, content, category)
  - Comment validation
- **Analytics & Tracking System**: 
  - IP geolocation tracking for visitor countries
  - Device type detection (mobile/desktop/other)
  - Traffic source classification (direct/social/search/referral)
  - Visitor ID tracking for unique vs returning visitors
  - Read time duration tracking
  - 30-day analytics trends
- **Comment System**: Full CRUD operations for comments
  - Create, read, update, delete comments
  - Permission checks (comment author and post author can delete)
  - Input validation
- **Caching Strategy**: Multi-layer Redis caching
  - Bulk posts list (10-minute TTL)
  - Popular posts (6-hour TTL)
  - Following posts (3-minute TTL)
  - Single post (2-minute TTL)
  - Cache invalidation on mutations
- **System Documentation**: Comprehensive architecture documentation
  - Created SYSTEM_OVERVIEW.md with detailed Mermaid diagrams
  - 8 detailed flow diagrams covering all major features
  - Complete technology stack documentation
  - Updated README with links to architecture docs and .env.example files

### Changed
- Applied validation schemas across all service layers
  - User services (signup, login, verify email, resend verification, forgot password, reset password)
  - Blog services (create post, update post)
  - Comment services (create comment, update comment)
- Enhanced error handling with proper validation messages
- Improved email templates for verification and password reset
- Updated OAuth handling to not interfere with password reset tokens
- Migrated from Hono/Cloudflare Workers to Express.js with Node.js
- Updated database schema with email verification and password reset fields

### Fixed
- Email verification not sending emails (fixed EMAIL_FROM configuration)
- Unverified users able to login (added emailVerifiedAt check for credential users)
- Verification email links not redirecting properly
- Password reset tokens disappearing from URL due to OAuth handler
- Validation errors not showing in toast notifications

### Security
- Bcrypt password hashing with 12 rounds
- JWT-based authentication
- Email verification enforcement for credential-based accounts
- Secure token generation for verification and password reset
- Input validation at all layers using Zod schemas

---

## [2.2.0] - 2025-08-12

### Added
- Write with AI feature - server + client integration to generate full articles using the configured generative model (adds /api/v1/ai/generate-article route and frontend controls to generate and insert HTML into the editor).
- Frontend UX for AI generation (loading state, confirmation before overwrite, insert generated HTML into editor for editing).

### Fixed
- Fix: thumbnail image URL was wrong.

---

## [2.1.0] - 2025-03-05

### Updated
- Change favicon and temporarily adjust linting settings.
- Reduce image sizes for improved performance.

---

## [2.0.0] - 2025-01-10

### Added
- Dockerfile and GitHub Actions workflows for CI / deployment.
- Conditional edit button rendering on profile (only show edit for user-owned blogs).
- LICENSE and expanded README.
- Enhanced About and Contact pages, improved footer integration.
- Improved user profile: additional fields (location, joined date), readTime on posts, and better post handling.
- Bookmarks, featured image support for posts, and improved file upload handling.
- For You page (personalized feed).
- Follow / unfollow functionality and newsletter validation.

### Changed
- Updated blog editing route and authentication middleware.
- Made PostgreSQL schema changes to support new fields.

### Fixed / Ops
- Deploy backend (deployment-related commits).
- Fix: dependency error in production.

---

## [1.0.0] - 2024-12-31

### Added
- Initial public release of Bloguer.
    - Initial commit and backend initialization.
    - Client: login and signup routes, blog page.
    - Basic user authentication (signup, login flows) and profile fetching.
    - Vercel configuration (vercel.json), minor client & UI updates.
    - Added avatar to user schema; added category, views, and Date to post schema.