
export const generateElementSpecificCSS = (componentId: string, customizableProps: any): string => {
  if (!customizableProps) return '';

  let css = '';
  
  Object.entries(customizableProps).forEach(([key, value]) => {
    if (key.endsWith('_styles') && value && typeof value === 'object') {
      const elementId = key.replace('_styles', '');
      const selector = `[data-element-id="${elementId}"]`;
      
      let elementCSS = '';
      
      if (value.tailwindCss) {
        elementCSS += `${selector} { @apply ${value.tailwindCss}; }`;
      }
      
      if (value.customCss && typeof value.customCss === 'object') {
        const customRules = Object.entries(value.customCss)
          .filter(([prop, val]) => prop !== 'className' && val)
          .map(([prop, val]) => `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};`)
          .join(' ');
        
        if (customRules) {
          elementCSS += `${selector} { ${customRules} }`;
        }
      }
      
      css += elementCSS;
    }
  });
  
  return css;
};
