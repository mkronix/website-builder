
import { Theme } from "@/contexts/editorTypes";

export const applyThemeToCode = (reactCode: string, theme: any, customizableProps?: Record<string, any>) => {
  if (!reactCode) return reactCode;

  let updatedCode = reactCode;

  // Enhanced theme variable replacement with comprehensive color mapping
  updatedCode = updatedCode
    // Primary colors - comprehensive replacement
    .replace(/className="([^"]*?)bg-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)([^"]*?)"/g,
      'className="$1bg-[var(--theme-primary)]$4" data-theme-element="primary-bg"')
    .replace(/className="([^"]*?)bg-gray-(\d+)([^"]*?)"/g,
      'className="$1bg-[var(--theme-secondary)]$3" data-theme-element="secondary-bg"')
    .replace(/className="([^"]*?)bg-white([^"]*?)"/g,
      'className="$1bg-[var(--theme-background)]$2" data-theme-element="background"')
    .replace(/className="([^"]*?)bg-black([^"]*?)"/g,
      'className="$1bg-[var(--theme-text)]$2" data-theme-element="text-bg"')
    .replace(/className="([^"]*?)bg-slate-(\d+)([^"]*?)"/g,
      'className="$1bg-[var(--theme-secondary)]$3" data-theme-element="secondary-bg"')

    // Text colors - comprehensive replacement
    .replace(/className="([^"]*?)text-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)([^"]*?)"/g,
      'className="$1text-[var(--theme-primary)]$4" data-theme-element="primary-text"')
    .replace(/className="([^"]*?)text-gray-900([^"]*?)"/g,
      'className="$1text-[var(--theme-text)]$2" data-theme-element="text"')
    .replace(/className="([^"]*?)text-gray-800([^"]*?)"/g,
      'className="$1text-[var(--theme-text)]$2" data-theme-element="text"')
    .replace(/className="([^"]*?)text-gray-700([^"]*?)"/g,
      'className="$1text-[var(--theme-muted)]$2" data-theme-element="muted-text"')
    .replace(/className="([^"]*?)text-gray-600([^"]*?)"/g,
      'className="$1text-[var(--theme-muted)]$2" data-theme-element="muted-text"')
    .replace(/className="([^"]*?)text-gray-500([^"]*?)"/g,
      'className="$1text-[var(--theme-muted-foreground)]$2" data-theme-element="muted-foreground"')
    .replace(/className="([^"]*?)text-gray-400([^"]*?)"/g,
      'className="$1text-[var(--theme-muted-foreground)]$2" data-theme-element="muted-foreground"')
    .replace(/className="([^"]*?)text-white([^"]*?)"/g,
      'className="$1text-[var(--theme-background)]$2" data-theme-element="background-text"')
    .replace(/className="([^"]*?)text-black([^"]*?)"/g,
      'className="$1text-[var(--theme-text)]$2" data-theme-element="text"')
    .replace(/className="([^"]*?)text-slate-(\d+)([^"]*?)"/g,
      'className="$1text-[var(--theme-muted)]$3" data-theme-element="muted-text"')

    // Border colors
    .replace(/className="([^"]*?)border-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)([^"]*?)"/g,
      'className="$1border-[var(--theme-primary)]$4" data-theme-element="primary-border"')
    .replace(/className="([^"]*?)border-gray-(\d+)([^"]*?)"/g,
      'className="$1border-[var(--theme-secondary)]$3" data-theme-element="secondary-border"')
    .replace(/className="([^"]*?)border-white([^"]*?)"/g,
      'className="$1border-[var(--theme-background)]$2" data-theme-element="background-border"')
    .replace(/className="([^"]*?)border-slate-(\d+)([^"]*?)"/g,
      'className="$1border-[var(--theme-secondary)]$3" data-theme-element="secondary-border"')

    // Hover states
    .replace(/className="([^"]*?)hover:bg-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)([^"]*?)"/g,
      'className="$1hover:bg-[var(--theme-primary-hover)]$4" data-theme-element="primary-hover"')
    .replace(/className="([^"]*?)hover:text-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)([^"]*?)"/g,
      'className="$1hover:text-[var(--theme-primary)]$4" data-theme-element="primary-text-hover"')
    .replace(/className="([^"]*?)hover:bg-gray-(\d+)([^"]*?)"/g,
      'className="$1hover:bg-[var(--theme-secondary-hover)]$3" data-theme-element="secondary-hover"')

    // Ring colors for focus states
    .replace(/className="([^"]*?)ring-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)([^"]*?)"/g,
      'className="$1ring-[var(--theme-primary)]$4" data-theme-element="primary-ring"')
    .replace(/className="([^"]*?)focus:ring-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)([^"]*?)"/g,
      'className="$1focus:ring-[var(--theme-primary)]$4" data-theme-element="primary-ring-focus"');

  return updatedCode;
};

export const generateThemeCSS = (theme: Theme) => {
  const primaryHover = adjustColorBrightness(theme.primary_color || '#007BFF', -0.1);
  const secondaryHover = adjustColorBrightness(theme.secondary_color || '#6C757D', -0.1);

  return `
    :root {
      --theme-primary: ${theme.primary_color || '#007BFF'};
      --theme-secondary: ${theme.secondary_color || '#6C757D'};
      --theme-background: ${theme.background || '#FAFAFA'};
      --theme-text: ${theme.text_primary || '#333333'};
      --theme-muted: ${adjustColorOpacity(theme.primary_color || '#007BFF', 0.7)};
      --theme-muted-foreground: ${adjustColorOpacity(theme.text_primary || '#333333', 0.5)};
      --theme-primary-hover: ${primaryHover};
      --theme-secondary-hover: ${secondaryHover};
    }
    
    /* Enhanced global theme classes with better specificity */
    .editor-canvas {
      --tw-primary: var(--theme-primary);
      --tw-secondary: var(--theme-secondary);
      --tw-background: var(--theme-background);
      --tw-text: var(--theme-text);
    }
    
<<<<<<< Updated upstream
    /* Direct theme element targeting with high specificity */
    .editor-canvas [data-theme-element="primary-bg"] { 
      background-color: var(--theme-primary) !important; 
    }
    .editor-canvas [data-theme-element="secondary-bg"] { 
      background-color: var(--theme-secondary) !important; 
    }
    .editor-canvas [data-theme-element="background"] { 
      background-color: var(--theme-background) !important; 
    }
    .editor-canvas [data-theme-element="text-bg"] { 
      background-color: var(--theme-text) !important; 
    }
    .editor-canvas [data-theme-element="primary-text"] { 
      color: var(--theme-primary) !important; 
    }
    .editor-canvas [data-theme-element="secondary-text"] { 
      color: var(--theme-secondary) !important; 
    }
    .editor-canvas [data-theme-element="text"] { 
      color: var(--theme-text) !important; 
    }
    .editor-canvas [data-theme-element="background-text"] { 
      color: var(--theme-background) !important; 
    }
    .editor-canvas [data-theme-element="muted-text"] { 
      color: var(--theme-muted) !important; 
    }
    .editor-canvas [data-theme-element="muted-foreground"] { 
      color: var(--theme-muted-foreground) !important; 
    }
    .editor-canvas [data-theme-element="primary-border"] { 
      border-color: var(--theme-primary) !important; 
    }
    .editor-canvas [data-theme-element="secondary-border"] { 
      border-color: var(--theme-secondary) !important; 
    }
    .editor-canvas [data-theme-element="background-border"] { 
      border-color: var(--theme-background) !important; 
    }
    
    /* Enhanced hover states */
    .editor-canvas [data-theme-element="primary-hover"]:hover { 
      background-color: var(--theme-primary-hover) !important; 
    }
    .editor-canvas [data-theme-element="secondary-hover"]:hover { 
      background-color: var(--theme-secondary-hover) !important; 
    }
    .editor-canvas [data-theme-element="primary-text-hover"]:hover { 
      color: var(--theme-primary) !important; 
    }
    
    /* Enhanced focus states */
    .editor-canvas [data-theme-element="primary-ring"]:focus,
    .editor-canvas [data-theme-element="primary-ring-focus"]:focus { 
      ring-color: var(--theme-primary) !important; 
      --tw-ring-color: var(--theme-primary) !important;
    }
    
    /* Legacy class support for backward compatibility */
    .editor-canvas .bg-blue-600,
    .editor-canvas .bg-blue-500,
=======
    /* Direct class replacements for theme colors */
    .editor-canvas .bg-[#272725],
    .editor-canvas .bg-[#272725],
>>>>>>> Stashed changes
    .editor-canvas .bg-indigo-600,
    .editor-canvas .bg-purple-600,
    .editor-canvas .bg-[#272725],
    .editor-canvas .bg-emerald-500,
    .editor-canvas .bg-primary { 
      background-color: var(--theme-primary) !important; 
    }
    
    .editor-canvas .bg-gray-100,
    .editor-canvas .bg-gray-50,
    .editor-canvas .bg-secondary { 
      background-color: var(--theme-secondary) !important; 
    }
    
    .editor-canvas .bg-white,
    .editor-canvas .bg-background { 
      background-color: var(--theme-background) !important; 
    }
    
    .editor-canvas .text-blue-600,
    .editor-canvas .text-blue-500,
    .editor-canvas .text-indigo-600,
    .editor-canvas .text-purple-600,
    .editor-canvas .text-emerald-600,
    .editor-canvas .text-emerald-500,
    .editor-canvas .text-primary { 
      color: var(--theme-primary) !important; 
    }
    
    .editor-canvas .text-gray-900,
    .editor-canvas .text-gray-800,
    .editor-canvas .text-gray-700,
    .editor-canvas .text-foreground { 
      color: var(--theme-text) !important; 
    }
    
    .editor-canvas .text-gray-600,
    .editor-canvas .text-gray-500,
    .editor-canvas .text-muted { 
      color: var(--theme-muted) !important; 
    }
    
    .editor-canvas .text-gray-400,
    .editor-canvas .text-muted-foreground { 
      color: var(--theme-muted-foreground) !important; 
    }
    
    .editor-canvas .text-white,
    .editor-canvas .text-background { 
      color: var(--theme-background) !important; 
    }
    
    /* Border colors */
    .editor-canvas .border-blue-600,
    .editor-canvas .border-blue-500,
    .editor-canvas .border-emerald-600,
    .editor-canvas .border-emerald-500,
    .editor-canvas .border-primary { 
      border-color: var(--theme-primary) !important; 
    }
    
    .editor-canvas .border-gray-200,
    .editor-canvas .border-gray-300,
    .editor-canvas .border-secondary { 
      border-color: var(--theme-secondary) !important; 
    }
    
    /* Hover states */
<<<<<<< Updated upstream
    .editor-canvas .hover\\:bg-blue-700:hover,
    .editor-canvas .hover\\:bg-blue-600:hover,
    .editor-canvas .hover\\:bg-emerald-700:hover,
    .editor-canvas .hover\\:bg-[#272725]:hover,
    .editor-canvas .hover\\:bg-primary\\/80:hover { 
      background-color: var(--theme-primary-hover) !important; 
    }
=======
    .editor-canvas .hover\\:bg-[#272725]:hover,
    .editor-canvas .hover\\:bg-[#272725]:hover,
    .editor-canvas .hover\\:bg-primary\\/80:hover { background-color: var(--theme-primary-hover) !important; }
>>>>>>> Stashed changes
    
    .editor-canvas .hover\\:text-blue-600:hover,
    .editor-canvas .hover\\:text-emerald-600:hover,
    .editor-canvas .hover\\:text-primary:hover { 
      color: var(--theme-primary) !important; 
    }
    
    /* Focus states */
    .editor-canvas .focus\\:ring-blue-500:focus,
    .editor-canvas .focus\\:ring-emerald-500:focus,
    .editor-canvas .focus\\:ring-primary:focus { 
      ring-color: var(--theme-primary) !important; 
      --tw-ring-color: var(--theme-primary) !important;
    }
  `;
};

// Enhanced color manipulation functions
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

export const generateElementSpecificCSS = (componentId: string, customizableProps: Record<string, any>): string => {
  if (!customizableProps) return '';

  let css = '';

  Object.entries(customizableProps).forEach(([key, value]) => {
    if (key.endsWith('_styles') && typeof value === 'object' && value !== null) {
      const elementId = key.replace('_styles', '');
      const styles = value as Record<string, string>;

      let cssRules: string[] = [];
      let tailwindClasses: string[] = [];

      Object.entries(styles).forEach(([property, val]) => {
        if (val && val !== 'undefined' && val !== '') {
          if (property === 'tailwindCss' && val) {
            // Collect Tailwind classes for separate application
            tailwindClasses.push(val);
          } else if (property === 'customCss' && typeof val === 'object') {
            // Handle custom CSS object
            Object.entries(val as Record<string, string>).forEach(([cssProp, cssVal]) => {
              if (cssVal && cssVal !== 'undefined') {
                const cssProperty = cssProp.replace(/([A-Z])/g, '-$1').toLowerCase();
                cssRules.push(`${cssProperty}: ${cssVal}`);
              }
            });
          } else if (property !== 'tailwindCss' && property !== 'customCss') {
            // Handle direct CSS properties
            const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
            cssRules.push(`${cssProperty}: ${val}`);
          }
        }
      });

      // Generate CSS for element with high specificity
      if (cssRules.length > 0) {
        css += `.editor-canvas [data-element-id="${elementId}"] { ${cssRules.join('; ')} !important; }\n`;
      }

      // Handle Tailwind CSS classes by adding them to the element
      if (tailwindClasses.length > 0) {
        const tailwindRule = tailwindClasses.join(' ');
        // For Tailwind classes, we need to ensure they're applied through the class attribute
        // This is handled in the component rendering phase
        css += `/* Tailwind classes for ${elementId}: ${tailwindRule} */\n`;
      }
    }
  });

  return css;
};
