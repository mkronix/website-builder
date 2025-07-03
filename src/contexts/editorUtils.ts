import { ComponentDefinition, PropValue, Theme } from "./editorTypes";

const mergeTheme = (templateTheme: Theme, currentTheme?: Theme): Theme => {
    return {
        primary_color: templateTheme.primary_color || templateTheme.primaryColor || currentTheme?.primary_color || '#3B82F6',
        secondary_color: templateTheme.secondary_color || templateTheme.secondaryColor || currentTheme?.secondary_color || '#8B5CF6',
        accent_color: templateTheme.accent_color || currentTheme?.accent_color || '#F59E0B',
        text_primary: templateTheme.text_primary || templateTheme.textColor || currentTheme?.text_primary || '#1F2937',
        text_secondary: templateTheme.text_secondary || currentTheme?.text_secondary || '#6B7280',
        background: templateTheme.background || templateTheme.backgroundColor || currentTheme?.background || '#FFFFFF',
        font_family: templateTheme.font_family || currentTheme?.font_family || 'Inter, sans-serif',
        font_headings: templateTheme.font_headings || currentTheme?.font_headings || 'Inter, sans-serif'
    };
};

const getDefaultProps = (componentId: string, componentDefinitions: Record<string, ComponentDefinition>): Record<string, PropValue> => {
    const component = componentDefinitions[componentId];
    return component?.default_props || {};
};

const mergeComponentProps = (
    templateProps: Record<string, PropValue>,
    defaultProps: Record<string, PropValue>
): Record<string, PropValue> => {
    const merged = { ...defaultProps };

    Object.keys(templateProps).forEach(key => {
        merged[key] = {
            ...defaultProps[key],
            ...templateProps[key]
        };
    });

    return merged;
};

export { mergeTheme, getDefaultProps, mergeComponentProps };