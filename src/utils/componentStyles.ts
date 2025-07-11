
export const generateElementSpecificCSS = (componentId: string, customizableProps: any): string => {
  if (!customizableProps) return '';

  let css = '';
  
  Object.entries(customizableProps).forEach(([key, value]) => {
    if (key.endsWith('_styles') && value && typeof value === 'object') {
      const elementId = key.replace('_styles', '');
      const selector = `[data-element-id="${elementId}"]`;
      
      let elementCSS = '';
      
      // Handle Tailwind CSS classes
      if ('tailwindCss' in value && value.tailwindCss && typeof value.tailwindCss === 'string') {
        // Apply Tailwind classes by adding them to the element's className
        elementCSS += `${selector} { @apply ${value.tailwindCss}; }`;
      }
      
      // Handle custom CSS properties
      if ('customCss' in value && value.customCss && typeof value.customCss === 'object') {
        const customRules = Object.entries(value.customCss)
          .filter(([prop, val]) => prop !== 'className' && val && val !== '')
          .map(([prop, val]) => {
            // Convert camelCase to kebab-case
            const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${kebabProp}: ${val};`;
          })
          .join(' ');
        
        if (customRules) {
          elementCSS += `${selector} { ${customRules} }`;
        }
      }
      
      // Handle direct style properties (fallback for legacy compatibility)
      const directStyleProps = Object.entries(value).filter(([prop, val]) => 
        !['tailwindCss', 'customCss'].includes(prop) && 
        val && 
        val !== '' &&
        typeof val === 'string'
      );
      
      if (directStyleProps.length > 0) {
        const directRules = directStyleProps
          .map(([prop, val]) => {
            const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${kebabProp}: ${val};`;
          })
          .join(' ');
        
        elementCSS += `${selector} { ${directRules} }`;
      }
      
      css += elementCSS;
    }
  });
  
  console.log('Generated element-specific CSS:', css);
  return css;
};
