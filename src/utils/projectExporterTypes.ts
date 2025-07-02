
interface Theme {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

interface Component {
    id: string;
    category: string;
    variant: string;
    default_props: Record<string, any>;
    react_code: string;
}

interface Page {
    id: string;
    name: string;
    slug: string;
    components: Component[];
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };
}

interface Project {
    id: string;
    name: string;
    description?: string;
    theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
    };
    settings?: {
        seo?: {
            title?: string;
            description?: string;
            keywords?: string[];
            author?: string;
            siteName?: string;
            twitterHandle?: string;
            ogImage?: string;
        };
        favicon?: string;
        global_meta?: {
            site_title?: string;
            site_description?: string;
            og_image?: string;
        };
        theme?: {
            primary_color?: string;
            secondary_color?: string;
            accent_color?: string;
            text_primary?: string;
            text_secondary?: string;
            background?: string;
            font_family?: string;
            font_headings?: string;
        };
        custom_css?: string;
    };
    created_at: string;
    updated_at: string;
}

interface ProjectData {
    project: Project;
    pages: Page[];
}

interface ExportSettings {
    includeAnimations: boolean;
    includeRouting: boolean;
    typescript: boolean;
    prettier: boolean;
    includeSEO: boolean;
    includeAnalytics: boolean;
    includeSitemap: boolean;
    includeRobots: boolean;
}
export type { Component, Page, Theme, Project, ProjectData, ExportSettings };