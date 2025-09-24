/**
 * Centralized type definitions for the AdarshRKumar.dev website
 * All interfaces and types used across the application
 */

// Blog and Content Types
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

// Enhanced Post Types for different use cases
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

// Author Types
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

// Portfolio Types
export interface PortfolioItem {
    file: string;
    frontmatter: {
        url: string;
        name: string;
    };
    rawContent: () => string;
}

// Video and Media Types
export interface VideoItem {
    link?: string;
    title?: string;
}

export interface RSSResponse {
    items?: Array<{
        link?: string;
        title?: string;
    }>;
    status?: string;
    feed?: {
        link?: string;
        title?: string;
    };
}

// YouTube Types
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

// Photo Types
export interface PhotoItem {
    src?: string;
    alt?: string;
    fullname?: string;
    data?: {
        title?: string;
        location?: string;
        info?: string;
    };
}

// Form Types
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

// Site Configuration Types
export interface SiteConfig {
    name: string;
    logo: string;
    favicon: string;
    placeholder: string;
}

// Grid and Layout Types
export interface GridOptions {
    min?: string;
    max?: string;
    keys?: string[];
    values?: {
        min?: string;
        max?: string;
    };
}

// Page Section Types
export interface PageSection {
    title: string;
    className: string;
}

// RSS Feed Types
export interface RSSItem {
    title: string;
    pubDate: string;
    description: string;
    link: string;
}

// Utility Types
export type PageType = 'home' | 'post' | 'author' | undefined;

export interface LayoutProps {
    title?: string;
    pTitle?: string;
    classItems?: string;
    inlineStyles?: string;
    pageType?: PageType;
    author?: string;
}

// Component Props Types
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

// Configuration Types
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

// Error Types
export interface ErrorInfo {
    type: string;
    message: string;
    code?: number;
}

// API Response Types
export interface APIResponse<T = any> {
    status: 'ok' | 'error';
    data?: T;
    error?: string;
}

// Content Processing Types
export interface ContentProcessor {
    cleanText: (text: string) => string;
    extractSlug: (filePath: string) => string;
    generatePreview: (text: string, maxLength?: number) => string;
}

// Image Processing Types
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