
import { Theme } from '@/contexts/editorTypes';

export const generateThemeCSS = (theme: Theme): string => {
  if (!theme) return '';

  return `
    :root {
      --theme-primary: ${theme.primaryColor || '#10B981'};
      --theme-secondary: ${theme.secondaryColor || '#059669'};
      --theme-background: ${theme.backgroundColor || '#FFFFFF'};
      --theme-text: ${theme.textColor || '#1F2937'};
    }

    [data-theme-applied] {
      background-color: var(--theme-background) !important;
      color: var(--theme-text) !important;
    }

    [data-theme-applied] .theme-primary {
      color: var(--theme-primary) !important;
    }

    [data-theme-applied] .theme-secondary {
      color: var(--theme-secondary) !important;
    }

    [data-theme-applied] .bg-theme-primary {
      background-color: var(--theme-primary) !important;
    }

    [data-theme-applied] .bg-theme-secondary {
      background-color: var(--theme-secondary) !important;
    }

    [data-theme-applied] .border-theme-primary {
      border-color: var(--theme-primary) !important;
    }

    [data-theme-applied] .hover\\:bg-theme-primary:hover {
      background-color: var(--theme-primary) !important;
    }

    [data-theme-applied] .hover\\:text-theme-primary:hover {
      color: var(--theme-primary) !important;
    }
  `;
};
