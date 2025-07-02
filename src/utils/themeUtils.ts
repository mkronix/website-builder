
export const applyThemeToCode = (reactCode: string, theme: any) => {
  if (!reactCode) return reactCode;

  // Replace hardcoded Tailwind color classes with theme variables
  let updatedCode = reactCode
    // Background colors
    .replace(/bg-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'bg-primary')
    .replace(/bg-gray-(\d+)/g, 'bg-secondary')
    .replace(/bg-white/g, 'bg-background')
    .replace(/bg-black/g, 'bg-text')
    
    // Text colors
    .replace(/text-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'text-primary')
    .replace(/text-gray-(\d+)/g, 'text-secondary')
    .replace(/text-white/g, 'text-background')
    .replace(/text-black/g, 'text-foreground')
    .replace(/text-gray-900/g, 'text-foreground')
    .replace(/text-gray-800/g, 'text-foreground')
    .replace(/text-gray-700/g, 'text-muted')
    .replace(/text-gray-600/g, 'text-muted')
    .replace(/text-gray-500/g, 'text-muted-foreground')
    
    // Border colors
    .replace(/border-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'border-primary')
    .replace(/border-gray-(\d+)/g, 'border-secondary')
    
    // Hover states
    .replace(/hover:bg-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'hover:bg-primary/80')
    .replace(/hover:text-(blue|indigo|purple|pink|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|violet|fuchsia|rose)-(\d+)/g, 'hover:text-primary');

  return updatedCode;
};

export const generateThemeCSS = (theme: any) => {
  return `
    :root {
      --theme-primary: ${theme.primaryColor};
      --theme-secondary: ${theme.secondaryColor};
      --theme-background: ${theme.backgroundColor};
      --theme-text: ${theme.textColor};
    }
    
    /* Base theme classes */
    .bg-primary { background-color: var(--theme-primary) !important; }
    .bg-secondary { background-color: var(--theme-secondary) !important; }
    .bg-background { background-color: var(--theme-background) !important; }
    .text-primary { color: var(--theme-primary) !important; }
    .text-secondary { color: var(--theme-secondary) !important; }
    .text-foreground { color: var(--theme-text) !important; }
    .text-background { color: var(--theme-background) !important; }
    .text-muted { color: color-mix(in srgb, var(--theme-text) 70%, transparent) !important; }
    .text-muted-foreground { color: color-mix(in srgb, var(--theme-text) 50%, transparent) !important; }
    .border-primary { border-color: var(--theme-primary) !important; }
    .border-secondary { border-color: var(--theme-secondary) !important; }
    
    /* Hover and interaction states */
    .hover\\:bg-primary\\/80:hover { background-color: color-mix(in srgb, var(--theme-primary) 80%, transparent) !important; }
    .hover\\:text-primary:hover { color: var(--theme-primary) !important; }
    .hover\\:bg-secondary\\/80:hover { background-color: color-mix(in srgb, var(--theme-secondary) 80%, transparent) !important; }
    
    /* Responsive design improvements */
    .editor-canvas {
      /* Ensure all elements are responsive */
    }
    .editor-canvas * {
      box-sizing: border-box;
    }
    .editor-canvas img,
    .editor-canvas video {
      max-width: 100%;
      height: auto;
    }
    .editor-canvas .container,
    .editor-canvas .max-w-6xl,
    .editor-canvas .max-w-5xl,
    .editor-canvas .max-w-4xl {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    @media (max-width: 768px) {
      .editor-canvas .grid-cols-2,
      .editor-canvas .grid-cols-3,
      .editor-canvas .grid-cols-4 {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      .editor-canvas .flex-row {
        flex-direction: column !important;
      }
      .editor-canvas .text-4xl,
      .editor-canvas .text-5xl,
      .editor-canvas .text-6xl {
        font-size: 2rem !important;
        line-height: 2.5rem !important;
      }
      .editor-canvas .p-8,
      .editor-canvas .p-12,
      .editor-canvas .p-16 {
        padding: 1rem !important;
      }
    }
    @media (max-width: 480px) {
      .editor-canvas .text-lg,
      .editor-canvas .text-xl,
      .editor-canvas .text-2xl {
        font-size: 1rem !important;
        line-height: 1.5rem !important;
      }
    }
  `;
};
