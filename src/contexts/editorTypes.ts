export interface StyleObject {
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface PropValue {
    type: 'text' | 'object' | 'array';
    value: any;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface NavigationItem {
    label: string;
    href: string;
    active?: boolean;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface ButtonValue {
    text: string;
    href: string;
    active?: boolean;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface ImageValue {
    src: string;
    alt: string;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface ContactInfo {
    email?: string;
    phone?: string;
    address?: string;
    business_hours?: string;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'textarea' | 'select';
    required?: boolean;
    options?: string[];
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface Feature {
    title: string;
    description: string;
    icon?: string;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface Service {
    title: string;
    description: string;
    icon?: string;
    features?: string[];
    pricing?: string;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface Stat {
    number: string;
    label: string;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface Testimonial {
    name: string;
    role: string;
    content: string;
    avatar?: string;
    rating?: number;
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface TeamMember {
    name: string;
    role: string;
    bio?: string;
    image?: string;
    social?: {
        active?: boolean;
        linkedin?: string;
        twitter?: string;
        [key: string]: any;
    };
    tailwindCss?: string;
    customCss?: Record<string, any>;
}

export interface Component {
    id: string;
    component_id?: string; // Reference to the component definition
    variant?: string;
    name?: string;
    description?: string;
    preview_image?: string;
    category: string;
    tags?: string[];
    order?: number;
    default_props?: Record<string, PropValue>;
    props?: Record<string, PropValue>;
    dependencies?: string[];
    react_code?: string;
    customizableProps?: Record<string, any>;
}

export interface PageMeta {
    title?: string;
    description?: string;
    keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
}

export interface Page {
    id: string;
    name: string;
    slug: string;
    meta?: PageMeta;
    custom_scripts?: string;
    components: Component[];
    seoTitle?: string; // Legacy support
    seoDescription?: string; // Legacy support
}

export interface Theme {
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    text_primary?: string;
    text_secondary?: string;
    background?: string;
    font_family?: string;
    font_headings?: string;
    // Legacy support for backward compatibility
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

export interface GlobalMeta {
    site_title?: string;
    site_description?: string;
    og_image?: string;
    keywords?: string;
}

export interface ProjectSettings {
    favicon?: string;
    global_meta?: GlobalMeta;
    theme?: Theme;
    custom_css?: string;
    custom_scripts?: string;
}

export interface Project {
    id: string;
    user_id?: string;
    name: string;
    description?: string;
    template_id?: string;
    template_used?: string; // Legacy support
    created_at?: string;
    updated_at?: string;
    last_modified?: string; // Legacy support
    is_exported?: boolean;
    export_count?: number;
    last_export?: string;
    settings?: ProjectSettings;
    pages: Page[];
    theme?: Theme;
    // Legacy support
    favicon?: string;
    global_meta?: GlobalMeta;
    custom_css?: string;
    custom_scripts?: string;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    preview_image?: string;
    tags?: string[];
    created_at?: string;
    updated_at?: string;
    is_premium?: boolean;
    usage_count?: number;
    global_meta?: GlobalMeta;
    favicon?: string;
    custom_css?: string;
    custom_scripts?: string;
    theme: Theme;
    pages: Array<{
        id: string;
        name: string;
        slug: string;
        meta?: PageMeta;
        custom_scripts?: string;
        components: Array<{
            id: string;
            component_id: string;
            order: number;
            props: Record<string, PropValue>;
            category: string;
        }>;
    }>;
}

export interface ComponentDefinition {
    id: string;
    name: string;
    variant?: string;
    category: string;
    description?: string;
    preview_image?: string;
    tags?: string[];
    default_props: Record<string, PropValue>;
    react_code?: string;
    dependencies?: string[];
}

export interface EditorState {
    currentPage: string;
    pages: Page[];
    selectedComponent: string | null;
    theme: Theme;
    previewMode: 'desktop' | 'tablet' | 'mobile';
    isDarkMode: boolean;
    template?: string;
    settings?: ProjectSettings;
}
