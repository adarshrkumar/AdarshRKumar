/**
 * Centralized type definitions for the AdarshRKumar.dev website
 * All interfaces and types used across the application
 */

import type { AstroComponentFactory } from "astro/runtime/server/index.js";

// Blog and content types
export interface Post {
    file: string;
    frontmatter: {
        title?: string;
        author?: string;
        date?: string;
        pubDate?: string;
        description?: string;
    };
    rawContent: () => string;
    compiledContent?: () => string;
}

// Enhanced post types for different use cases
export interface PostWithSlug extends Post {
    slug: string;
}

export interface PostWithDisplay extends Post {
    slug: string;
    url: string;
    screenshotImage: {
        src: string;
        alt: string;
        placeholder: string;
    };
}

export interface PostForRSS extends Post {
    id: string;
    link: string;
}

// Author types
export interface Author {
    displayName: string;
    bio: string;
    pfp?: {
        filename: string;
    };
}

export interface Authors {
    [key: string]: Author;
}

// Portfolio types
export interface PortfolioItem {
    file: string;
    frontmatter: {
        url: string;
        name: string;
        target?: string;
        projectsCategory?: string;
    };
    rawContent: () => string;
}

// Video and media types
export interface VideoItem {
    link?: string;
    title?: string;
}


// YouTube types
export interface YouTubeVideo {
    guid: string;
    title: string;
    author: string;
    link?: string;
}

export interface YouTubeFeed {
    link: string;
    title: string;
}

// Photo types (database-backed)
export interface PhotoMetadata {
    title?: string;
    location?: string;
    info?: string;
    fullname?: string;
    name?: string;
    category?: string;
    uploader?: string;
}

export interface PhotoImport {
    src: string;
    [key: string]: string | undefined;
}

export interface PhotoItem {
    src?: string;
    alt?: string;
    fullname?: string;
    import?: PhotoImport;
    data?: PhotoMetadata;
}

// Database photo type (from Drizzle schema)
export interface DBPhoto {
    id: string;
    name: string;
    fullname: string;
    extention: string;
    category: string;
    title: string;
    uploader: string;
    imageKey: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

// Database post type (from Drizzle schema)
export interface DBPost {
    id: string;
    slug: string;
    title: string;
    content: string;
    author: string;
    categories: string;
    createdAt: Date;
    updatedAt: Date;
}

// Form types
export interface FormField {
    type: string;
    name: string;
    id: string;
    placeholder?: string;
    required?: string;
    align?: string;
    label?: string;
    className?: string;
    style?: string;
    value?: string;
}

export interface FormConfig {
    action: string;
    method: string;
    className: string;
}

// Site configuration types
export interface SiteConfig {
    name: string;
    logo: string;
    favicon: string;
    placeholder: string;
}

// Grid and layout types
export interface GridOptions {
    min?: string;
    max?: string;
    'max-width'?: string;
    keys?: string[];
    values?: {
        min?: string;
        max?: string;
    };
}

// Navigation types
export interface NavItem {
    name: string;
    url: string;
    target?: string;
    primaryCls?: string;
}

// Page import types
export interface PageImport {
    url: string;
    [key: string]: string | undefined;
}

// RSS response types
export interface RSSResponse {
    status: string;
    items?: Array<{
        link?: string;
        title?: string;
    }>;
    feed?: {
        link?: string;
        title?: string;
    };
}

// Context types
export interface AstroContext {
    site: string | URL;
    trailingSlash: boolean;
    [key: string]: URL | string | boolean | undefined;
}

export interface PageSection {
    id: string;
    title: string;
    className: string;
    element: AstroComponentFactory;
}

// RSS feed types
export interface RSSItem {
    title: string;
    pubDate: string;
    description: string;
    link: string;
}

// Utility types
export type PageType = 'home' | 'post' | 'author' | undefined;

export interface LayoutProps {
    title?: string;
    pTitle?: string;
    classItems?: string;
    inlineStyles?: string;
    pageType?: PageType;
    author?: string;
}

// Component props types
export interface SiteGridContentProps {
    id?: string;
    classItems?: string;
    options?: GridOptions;
}

export interface ChannelVideosProps {
    id: string;
    vidsPerChannel?: number | string;
}

export interface LargeFrameProps {
    video: YouTubeVideo;
    feed: YouTubeFeed;
}

// Configuration types
export interface MusicPlaylistConfig {
    playlists: string[];
    channelId: string;
    videosPerChannel: number;
}

export interface VideoChannelConfig {
    channelIds: string[];
    videosPerChannel: number;
    gridOptions: GridOptions;
}

export interface ProjectCategoryConfig {
    id: string;
    name: string;
    items: PortfolioItem[];
}

// Error types
export interface ErrorInfo {
    type: string;
    message: string;
    code?: number;
}

// API response types
export interface APIResponse<T> {
    status: 'ok' | 'error';
    data?: T;
    error?: string;
}

// Content processing types
export interface ContentProcessor {
    cleanText: (text: string) => string;
    extractSlug: (filePath: string) => string;
    generatePreview: (text: string, maxLength?: number) => string;
}

// Image processing types
export interface ImageConfig {
    src: string;
    alt: string;
    placeholder?: string;
    style?: string;
}

export interface ScreenshotConfig {
    url: string;
    title: string;
    imageSize?: number;
}

// Instagram types
export interface InstagramProfile {
    full_name: string;
    biography: string;
    profile_pic_url: string;
    profile_pic_url_hd?: string;
    edge_followed_by: { count: number };
    edge_follow: { count: number };
    edge_owner_to_timeline_media: { count: number };
    username?: string;
    is_verified?: boolean;
}

export interface InstagramMediaNode {
    display_url: string;
    shortcode: string;
    edge_media_to_caption?: { edges: Array<{ node: { text: string } }> };
    taken_at_timestamp?: number;
    is_video: boolean;
    video_url?: string;
    thumbnail_src?: string;
    edge_liked_by?: { count: number };
    edge_media_to_comment?: { count: number };
}

export interface InflactMediaItem {
    id?: string;
    shortCode?: string;
    shortcode?: string;
    imageUrl?: string;
    display_url?: string;
    mediaType?: number;
    is_video?: boolean;
    caption?: string;
    createdAt?: number;
    taken_at_timestamp?: number;
    thumbnail_src?: string;
    video_url?: string;
    edge_media_to_caption?: { edges: Array<{ node: { text: string } }> };
    edge_liked_by?: { count: number };
    edge_media_to_comment?: { count: number };
}

export interface InstagramStory {
    image_versions2?: { candidates: Array<{ url: string }> };
    video_versions?: Array<{ url: string }>;
    taken_at?: number;
    id?: string;
}

export interface InstagramData {
    profile: InstagramProfile | null;
    posts: InstagramMediaNode[];
    reels: InstagramMediaNode[];
    stories: InstagramStory[];
    error: string | null;
}