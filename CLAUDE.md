# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Adarsh Kumar built with Astro 5. Features blog, photography gallery, project showcase, and portfolio sections.

**Tech Stack**: Astro 5 (SSR), TypeScript (strict), SCSS, Drizzle ORM + Vercel Postgres

## Essential Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run dev:verbose  # Start dev server with verbose logging
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
npm run astro        # Run Astro CLI commands
npx drizzle-kit generate  # Generate database migrations
npx drizzle-kit push      # Push schema changes to database
npx drizzle-kit studio    # Open Drizzle Studio (database GUI)
```

## Environment Variables

- `POSTGRES_URL` - Vercel Postgres connection string (auto-provided in Vercel)

## Architecture Overview

### Content Structure

- **Blog Posts** - Dual-source system:
  - **File-based**: `content/blog/posts/*.md` with frontmatter: `title`, `author`, `date`, `categories`
  - **Database-backed**: Postgres table via Drizzle ORM (schema: `src/db/schema.ts`)
  - Both sources merged in `getPosts()`, sorted by created date (most recent first)
  - URL pattern: `/post/{slug}/`
- **Projects** (`content/work/projects/{large-scale,utilities,games}/*.md`): Frontmatter: `name`, `url`, `target`
- **Portfolio** (`content/work/portfolio/*.md`): Same frontmatter as projects
- **Site Metadata**: `content/aboutContent.md` (site description), `content/siteKeywords.json` (SEO keywords)
- **Draft convention**: Prefix filename with `_` to exclude from builds

### Database Schema

**Vercel Postgres via Drizzle ORM** (`src/db/schema.ts`, `drizzle.config.ts`):

- **Photos table**: id, name, fullname, extention, category, title, uploader, imageKey, imageUrl, createdAt, updatedAt
  - Query functions in `src/lib/getPhotos.ts`: `getAllPhotos()`, `getPhotosByCategory()`, `getPhotoByName()`, `getPhotoCategories()`
- **Posts table**: id, slug (unique), title, content, videoId, author, categories (comma-separated), createdAt, updatedAt
  - Merged with file-based posts in `getPosts()`
- **Migrations**: `drizzle-kit generate` creates migrations in `src/db/migrations/`
- **Database connection**: Initialized in `src/db/initialize.ts`

### Key Patterns

**Post Management** (`src/lib/getPosts.ts`):

- **Dual-source system**: Combines file-based posts (`import.meta.glob()`) and database posts
- `getLocalPosts()`: File-based posts only, filters out `_` prefixed files
- `getDBPosts()`: Async query for database posts, converts to `Post` format
- `getPosts()`: **Main function** - merges both sources, sorted by created date (newest first)
- `getPostsSync()`: Synchronous version (local posts only, for compatibility)
- `getPostsForDisplay(siteUrl)`: Adds slug, URL, screenshot metadata for rendering
- `getFeaturedPosts(slugArray)`: Posts matching provided slugs
- `findPostById(postId)`: Single post lookup across both sources
- `getPostsForRSS()`: RSS feed format at `/rss.xml`
- **Helper functions**: `extractSlugFromFilePath()`, `generateScreenshotImage()`, `cleanTextContent()`, `createPreviewContent()`

**Layout System** (`src/layouts/Layout.astro`):

- Page types: `home`, `post`, `author` - affects title formatting
- `{ age }` placeholder replaced with calculated age (birthdate: March 28, 2007)
- SEO from `aboutContent.md` and `siteKeywords.json`

**Screenshot Service**: `https://webshot.adarshrkumar.dev/api/take` for automatic post screenshots

### Conventions

- **Types**: Centralized in `src/lib/types.ts`
- **Styling**: SCSS in `src/styles/` - `components/`, `pages/`, `globals.scss`, `variables.scss`, `mixins.scss`
- **CSS Classes**:
  - USE `__` (double underscores) for BEM elements (e.g., `.item__title`, `.card__image`)
  - DO NOT use `--` (double hyphens) for BEM modifiers - use data attributes instead (e.g., `[data-state="active"]`, `[data-size="large"]`)
  - DO NOT use compound class selectors (e.g., `.class.modifier`) - use data attributes instead (e.g., `.class[data-variant="modifier"]`)
  - EXCEPTION: Compound selectors with layout-related classes (e.g., `.videos.grid`) are allowed for `data-layout` purposes
- **Buttons**: All buttons should use the `.btn` base class from `globals.scss`. Use `data-primary="true"` attribute for primary button variant.
- **Helper functions**: Placed at file top with `// Helper functions` comment
- **Scripts**: Custom `<Script />` component in `src/utils/script.astro`
- **Authors**: `src/lib/authors.ts`, pages at `/author/[username]`

### Site Configuration

- Site URL: `https://adarshrkumar.dev`
- Trailing slashes: Always enforced
- SSR: Vercel adapter with sitemap integration

## Key Files

| File | Purpose |
| ------ | --------- |
| `src/lib/getPosts.ts` | Post management (dual-source: files + DB) |
| `src/lib/getPhotos.ts` | Database photo queries |
| `src/lib/types.ts` | All TypeScript definitions |
| `src/db/schema.ts` | Database schema (photos + posts tables) |
| `src/db/initialize.ts` | Database connection setup |
| `src/layouts/Layout.astro` | Base layout with SEO |
| `astro.config.mjs` | Astro config (SSR, Vercel adapter, CSP) |
| `drizzle.config.ts` | Drizzle ORM configuration |
