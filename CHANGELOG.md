# Changelog
All notable changes to this project will be documented in this file.

---

## [1.3.0] - 2025-08-12

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