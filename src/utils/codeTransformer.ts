
import { Theme } from '@/contexts/editorTypes';

export const applyThemeToCode = (code: string, theme: Theme): string => {
  if (!code || !theme) return code;

  let themedCode = code;

  // Add theme data attribute to root elements
  themedCode = themedCode.replace(
    /(<div[^>]*className="[^"]*")/g,
    '$1 data-theme-applied="true"'
  );

  // Replace color classes with theme-aware classes
  const colorMappings = {
    'text-gray-900': 'theme-primary',
    'text-gray-800': 'theme-secondary',
    'bg-blue-500': 'bg-theme-primary',
    'bg-blue-600': 'bg-theme-secondary',
    'border-blue-500': 'border-theme-primary',
    'hover:bg-blue-600': 'hover:bg-theme-primary',
    'hover:text-blue-600': 'hover:text-theme-primary'
  };

  Object.entries(colorMappings).forEach(([original, themed]) => {
    const regex = new RegExp(original, 'g');
    themedCode = themedCode.replace(regex, themed);
  });

  return themedCode;
};
