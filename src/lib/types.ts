/**
 * Centralized type definitions for the AdarshRKumar.dev website
 * All interfaces and types used across the application
 */

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
    hasPfp: boolean;
    pfp: {
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

// Photo types
export interface PhotoMetadata {
    title?: string;
    location?: string;
    info?: string;
    fullname?: string;
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
    title: string;
    className: string;
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
    mode?: string;
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