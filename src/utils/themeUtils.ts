
export const applyThemeToCode = (reactCode: string, theme: any, customizableProps?: Record<string, any>) => {
  if (!reactCode) return reactCode;

  let updatedCode = reactCode;

  // Apply global theme variables first
  updatedCode = updatedCode
    // Background colors - more comprehensive replacement
    .replace(/bg-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'bg-[var(--theme-primary)]')
    .replace(/bg-gray-(\d+)/g, 'bg-[var(--theme-secondary)]')
    .replace(/bg-white/g, 'bg-[var(--theme-background)]')
    .replace(/bg-black/g, 'bg-[var(--theme-text)]')
    .replace(/bg-slate-(\d+)/g, 'bg-[var(--theme-secondary)]')

    // Text colors - more comprehensive replacement
    .replace(/text-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'text-[var(--theme-primary)]')
    .replace(/text-gray-900/g, 'text-[var(--theme-text)]')
    .replace(/text-gray-800/g, 'text-[var(--theme-text)]')
    .replace(/text-gray-700/g, 'text-[var(--theme-muted)]')
    .replace(/text-gray-600/g, 'text-[var(--theme-muted)]')
    .replace(/text-gray-500/g, 'text-[var(--theme-muted-foreground)]')
    .replace(/text-gray-400/g, 'text-[var(--theme-muted-foreground)]')
    .replace(/text-white/g, 'text-[var(--theme-background)]')
    .replace(/text-black/g, 'text-[var(--theme-text)]')
    .replace(/text-slate-(\d+)/g, 'text-[var(--theme-muted)]')

    // Border colors
    .replace(/border-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'border-[var(--theme-primary)]')
    .replace(/border-gray-(\d+)/g, 'border-[var(--theme-secondary)]')
    .replace(/border-white/g, 'border-[var(--theme-background)]')
    .replace(/border-slate-(\d+)/g, 'border-[var(--theme-secondary)]')

    // Hover states
    .replace(/hover:bg-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'hover:bg-[var(--theme-primary-hover)]')
    .replace(/hover:text-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'hover:text-[var(--theme-primary)]')
    .replace(/hover:bg-gray-(\d+)/g, 'hover:bg-[var(--theme-secondary-hover)]')

    // Ring colors for focus states
    .replace(/ring-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'ring-[var(--theme-primary)]')
    .replace(/focus:ring-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'focus:ring-[var(--theme-primary)]');

  // Apply individual element customizations if they exist
  if (customizableProps) {
    Object.entries(customizableProps).forEach(([key, value]) => {
      if (key.includes('_styles') && typeof value === 'object' && value !== null) {
        // This will be handled by the component renderer
        return;
      }
      
      if (key.includes('_content') && typeof value === 'string') {
        const elementType = key.replace('_content', '');
        // Apply content changes without affecting global theme
        const contentRegex = new RegExp(`(data-prop-path="[^"]*${elementType}[^"]*"[^>]*>)([^<]*)(</[^>]*>)`, 'g');
        updatedCode = updatedCode.replace(contentRegex, `$1${value}$3`);
      }
    });
  }

  return updatedCode;
};

export const generateThemeCSS = (theme: any) => {
  const primaryHover = adjustColorBrightness(theme.primaryColor, -0.1);
  const secondaryHover = adjustColorBrightness(theme.secondaryColor, -0.1);
  
  return `
    :root {
      --theme-primary: ${theme.primaryColor};
      --theme-secondary: ${theme.secondaryColor};
      --theme-background: ${theme.backgroundColor};
      --theme-text: ${theme.textColor};
      --theme-muted: ${adjustColorOpacity(theme.textColor, 0.7)};
      --theme-muted-foreground: ${adjustColorOpacity(theme.textColor, 0.5)};
      --theme-primary-hover: ${primaryHover};
      --theme-secondary-hover: ${secondaryHover};
    }
    
    /* Global theme classes */
    .bg-primary { background-color: var(--theme-primary) !important; }
    .bg-secondary { background-color: var(--theme-secondary) !important; }
    .bg-background { background-color: var(--theme-background) !important; }
    .text-primary { color: var(--theme-primary) !important; }
    .text-secondary { color: var(--theme-secondary) !important; }
    .text-foreground { color: var(--theme-text) !important; }
    .text-background { color: var(--theme-background) !important; }
    .text-muted { color: var(--theme-muted) !important; }
    .text-muted-foreground { color: var(--theme-muted-foreground) !important; }
    .border-primary { border-color: var(--theme-primary) !important; }
    .border-secondary { border-color: var(--theme-secondary) !important; }
    
    /* Hover and interaction states */
    .hover\\:bg-primary\\/80:hover { background-color: var(--theme-primary-hover) !important; }
    .hover\\:text-primary:hover { color: var(--theme-primary) !important; }
    .hover\\:bg-secondary\\/80:hover { background-color: var(--theme-secondary-hover) !important; }
    
    /* Component-specific theme application */
    .editor-canvas [data-theme-element="primary-bg"] { background-color: var(--theme-primary) !important; }
    .editor-canvas [data-theme-element="secondary-bg"] { background-color: var(--theme-secondary) !important; }
    .editor-canvas [data-theme-element="primary-text"] { color: var(--theme-primary) !important; }
    .editor-canvas [data-theme-element="secondary-text"] { color: var(--theme-secondary) !important; }
    .editor-canvas [data-theme-element="text"] { color: var(--theme-text) !important; }
    .editor-canvas [data-theme-element="background"] { background-color: var(--theme-background) !important; }
    
    /* Individual element overrides */
    .editor-canvas [data-element-id] {
      transition: all 0.2s ease-in-out;
    }
  `;
};

// Helper functions for color manipulation
const adjustColorBrightness = (color: string, amount: number): string => {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + Math.round(255 * amount)));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * amount)));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + Math.round(255 * amount)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
  return color;
};

const adjustColorOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const generateElementSpecificCSS = (elementId: string, styles: Record<string, any>): string => {
  let css = '';
  const selector = `[data-element-id="${elementId}"]`;
  
  const cssRules: string[] = [];
  
  Object.entries(styles).forEach(([property, value]) => {
    if (value && value !== 'undefined' && value !== '') {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      cssRules.push(`${cssProperty}: ${value}`);
    }
  });
  
  if (cssRules.length > 0) {
    css = `.editor-canvas ${selector} { ${cssRules.join('; ')} !important; }`;
  }
  
  return css;
};
