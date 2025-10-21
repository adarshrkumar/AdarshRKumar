# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Adarsh Kumar built with Astro 5. The site features a blog, photography gallery, project showcase, and portfolio sections. It uses TypeScript, SCSS for styling, and has a custom build process for managing photo content.

## Essential Commands

```bash
# Development
npm run dev          # Start dev server at localhost:4321
npm run start        # Alias for dev

# Production
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally

# Astro CLI
npm run astro ...    # Run Astro CLI commands
```

## Architecture Overview

### Build Process and Content Management

**Critical**: The build process runs custom content processing scripts BEFORE Astro builds:

1. **Image Update Script** (`update.ts`): Automatically organizes loose photo files in `content/photos/` into structured folders with `info.json` metadata files
2. **Photo Aggregation** (`astro.config.mjs`): During build, collects all photos from category folders (`content/photos/nature/`, `content/photos/places/`, etc.) and aggregates them into `content/allPhotos/` for easier consumption by pages
3. **JSON-to-JS Conversion**: Converts `info.json` files to `.js` modules with default exports for Astro consumption

### Content Structure

- **Blog Posts** (`content/blog/posts/`): Markdown files with frontmatter. Files prefixed with `_` are drafts (not published)
- **Photos** (`content/photos/{category}/{photoName}/`): Each photo has its own folder containing:
  - The image file
  - `info.json` with metadata (name, title, category, uploader, etc.)
- **Projects & Portfolio** (`content/work/`): Markdown files organized by type:
  - `portfolio/`: Featured portfolio items
  - `projects/large-scale/`: Major projects
  - `projects/utilities/`: Smaller utility projects
  - `projects/games/`: Game projects

### Key Architectural Patterns

**Post Management** (`src/lib/getPosts.ts`):
- Uses Vite's `import.meta.glob()` for file-based routing
- Multiple helper functions for different use cases:
  - `getPosts()`: Raw posts
  - `getPostsForDisplay()`: Posts with computed metadata (slug, URL, screenshot)
  - `getFeaturedPosts()`: Filter by slug array
  - `findPostById()`: Single post lookup
  - `getPostsForRSS()`: RSS feed formatting
- Screenshots generated via external service: `https://webshot.adarshrkumar.dev/take`

**Layout System** (`src/layouts/Layout.astro`):
- Single base layout for all pages
- Page types: `home`, `post`, `author` (affects title formatting and rendering)
- Dynamic content injection with `{ age }` placeholder replacement (calculated from `src/lib/getAge.ts`)
- SEO metadata, Open Graph, and Twitter card support

**Photo Gallery**:
- Categories can be hidden by naming folder `hide`
- Photos without explicit titles (starting with `IMG_`) get auto-generated titles from filename
- Build-time processing ensures all photos are accessible via `content/allPhotos/`

### Project-Specific Conventions

- **Draft Files**: Prefix with `_` (e.g., `_draft-post.md`) to exclude from builds
- **TypeScript**: Strict mode enabled, uses Astro's base TypeScript config
- **Styling**: Component-specific SCSS in `src/styles/components/`, page-specific in `src/styles/pages/`
- **Author System**: Multi-author support via `src/lib/authors.ts` and author pages at `/author/[username]`

### Site Configuration

- **Site URL**: `https://adarshrkumar.dev`
- **Trailing Slashes**: Always enforced (`trailingSlash: 'always'`)
- **CSP Headers**: Configured in Vite dev server with specific allow-lists for external services
- **External APIs**: RSS feed via rss2json.com, social sharing via ShareThis

## Development Notes

- When adding new photos: Drop image files into appropriate category folder in `content/photos/{category}/`, then run build (update.ts will auto-generate structure)
- Blog post slugs are derived from markdown filenames in `content/blog/posts/`
- The site uses custom RSS generation at `/rss.xml` via `src/pages/rss.xml.ts`
- Theme switching functionality is available via `src/components/themeSwitcher.astro`
