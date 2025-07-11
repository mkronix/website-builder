import { Component, ExportSettings, Page, Project } from "./projectExporterTypes";
import { capitalizeFirst, generatePropsString, getComponentName } from "./projectExporterUtils";

const generateComponentCode = (component: Component, settings: ExportSettings): string => {
  const componentName = getComponentName(component.react_code);
  const imports = generateComponentImports(component, settings);

  // Convert TypeScript to JavaScript and clean up the code
  let cleanCode = component.react_code
    .replace(/: React\.FC.*?=/g, ' =')
    .replace(/: React\.\w+/g, '')
    .replace(/interface\s+\w+\s*{[^}]*}/g, '')
    .replace(/\w+:\s*\w+(\[\])?[,;]/g, '')
    .replace(/useState<.*?>/g, 'useState')
    .replace(/useEffect<.*?>/g, 'useEffect')
    .replace(/\.tsx?/g, '.jsx');

  // Add error boundaries and accessibility improvements
  const enhancedCode = addAccessibilityEnhancements(cleanCode);

  // Generate custom styles for this component
  const customStyles = generateComponentCustomStyles(component);

  return `${imports}

${enhancedCode}

${customStyles ? `
// Custom styles for this component
const customStyles = \`${customStyles}\`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}
` : ''}

export default ${componentName};
`;
};

const generateComponentCustomStyles = (component: Component): string => {
  if (!component.customizableProps) return '';

  let css = '';
  
  Object.entries(component.customizableProps).forEach(([key, value]) => {
    if (key.endsWith('_styles') && value && typeof value === 'object') {
      const elementId = key.replace('_styles', '');
      const selector = `[data-element-id="${elementId}"]`;
      
      let elementCSS = '';
      
      // Handle Tailwind CSS classes
      if ('tailwindCss' in value && value.tailwindCss && typeof value.tailwindCss === 'string') {
        // For export, we need to convert Tailwind classes to actual CSS
        elementCSS += `${selector} { ${convertTailwindToCSS(value.tailwindCss)} }`;
      }
      
      // Handle custom CSS properties
      if ('customCss' in value && value.customCss && typeof value.customCss === 'object') {
        const customRules = Object.entries(value.customCss)
          .filter(([prop, val]) => prop !== 'className' && val && val !== '')
          .map(([prop, val]) => {
            const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${kebabProp}: ${val};`;
          })
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

const convertTailwindToCSS = (tailwindClasses: string): string => {
  // Basic Tailwind to CSS conversion - this is a simplified version
  // In a real implementation, you'd want a more comprehensive mapping
  const classMap: Record<string, string> = {
    'text-center': 'text-align: center;',
    'text-left': 'text-align: left;',
    'text-right': 'text-align: right;',
    'font-bold': 'font-weight: bold;',
    'italic': 'font-style: italic;',
    'underline': 'text-decoration: underline;',
    'text-lg': 'font-size: 1.125rem;',
    'text-xl': 'font-size: 1.25rem;',
    'text-sm': 'font-size: 0.875rem;',
    'p-2': 'padding: 0.5rem;',
    'p-4': 'padding: 1rem;',
    'p-6': 'padding: 1.5rem;',
    'm-2': 'margin: 0.5rem;',
    'm-4': 'margin: 1rem;',
    'm-6': 'margin: 1.5rem;',
    'rounded-lg': 'border-radius: 0.5rem;',
    'rounded-full': 'border-radius: 9999px;',
    'rounded-none': 'border-radius: 0;',
    'shadow-md': 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);',
    'shadow-lg': 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);',
    'shadow-2xl': 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);',
    'w-full': 'width: 100%;',
    'w-auto': 'width: auto;',
    'block': 'display: block;',
    'inline-block': 'display: inline-block;',
    'flex': 'display: flex;',
    'items-center': 'align-items: center;',
    'justify-center': 'justify-content: center;',
  };

  const classes = tailwindClasses.split(' ').filter(cls => cls.trim());
  const cssRules = classes.map(cls => classMap[cls] || '').filter(rule => rule);
  
  return cssRules.join(' ');
};

const generateComponentImports = (component: Component, settings: ExportSettings): string => {
  const imports = [`import React from 'react';`];

  // Add React hooks imports
  if (component.react_code.includes('useState')) {
    imports[0] = `import React, { useState } from 'react';`;
  }

  if (component.react_code.includes('useEffect')) {
    imports[0] = imports[0].includes('useState')
      ? `import React, { useState, useEffect } from 'react';`
      : `import React, { useEffect } from 'react';`;
  }

  // Add framer-motion import if animations are enabled
  if (settings.includeAnimations && (component.react_code.includes('animate') || component.category === 'hero')) {
    imports.push(`import { motion } from 'framer-motion';`);
  }

  // Add utility imports
  imports.push(`import { cn } from '../../utils/cn';`);

  // Add SEO components if needed
  if (settings.includeSEO && component.category === 'hero') {
    imports.push(`import { SEOHead } from '../seo/SEOHead';`);
  }

  return imports.join('\n');
};

const generatePageCode = (
  page: Page,
  pageComponents: Component[],
  settings: ExportSettings,
  project: Project
): string => {
  const componentImports = pageComponents.map(comp => {
    const componentName = getComponentName(comp.react_code);
    return `import ${componentName} from '../components/${comp.category}/${componentName}';`;
  }).join('\n');

  const componentJSX = pageComponents.map(comp => {
    const componentName = getComponentName(comp.react_code);
    const propsString = generatePropsString(comp.default_props);
    return `      <${componentName}${propsString} />`;
  }).join('\n');

  let pageWrapper = `    <div className="min-h-screen">
${componentJSX}
    </div>`;

  if (settings.includeAnimations) {
    pageWrapper = `    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen"
    >
${componentJSX}
    </motion.div>`;
  }

  const motionImports = settings.includeAnimations
    ? `import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '../utils/animations';`
    : '';

  const seoImports = settings.includeSEO
    ? `import { SEOHead } from '../components/seo/SEOHead';
import { SchemaMarkup } from '../components/seo/SchemaMarkup';`
    : '';

  const seoComponent = settings.includeSEO ? `
      <SEOHead
        title="${page.seo?.title || `${page.name} | ${project.name}`}"
        description="${page.seo?.description || project.settings?.seo?.description || ''}"
        keywords={${JSON.stringify(page.seo?.keywords || [])}}
        ogImage="${page.seo?.ogImage || '/og-image.jpg'}"
        canonical="${page.slug}"
      />
      <SchemaMarkup
        type="WebPage"
        name="${page.name}"
        description="${page.seo?.description || project.settings?.seo?.description || ''}"
        url="${page.slug}"
      />` : '';

  return `import React from 'react';
${motionImports}
${seoImports}
${componentImports}

const ${capitalizeFirst(page.name)}Page = () => {
  return (
    <>
      ${seoComponent}
${pageWrapper}
    </>
  );
};

export default ${capitalizeFirst(page.name)}Page;
`;
};
const generateAppCode = (pages: Page[], project: Project, settings: ExportSettings): string => {
  const pageImports = pages.map(page =>
    `import ${capitalizeFirst(page.name)}Page from './pages/${capitalizeFirst(page.name)}'`
  ).join('\n');

  const routes = pages.map(page =>
    `        <Route path="${page.slug === '/' ? '/' : page.slug}" element={<${capitalizeFirst(page.name)}Page />} />`
  ).join('\n');

  const routerImports = settings.includeRouting
    ? `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';`
    : '';

  const animationImports = settings.includeAnimations
    ? `import { AnimatePresence } from 'framer-motion';`
    : '';

  const analyticsImport = settings.includeAnalytics
    ? `import Analytics from './components/seo/Analytics';`
    : '';

  let appContent;

  if (settings.includeRouting) {
    const routesWrapper = settings.includeAnimations
      ? `        <AnimatePresence mode="wait">
          <Routes>
${routes}
            <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold text-gray-600">404 - Page Not Found</h1></div>} />
          </Routes>
        </AnimatePresence>`
      : `        <Routes>
${routes}
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold text-gray-600">404 - Page Not Found</h1></div>} />
        </Routes>`;

    appContent = `    <Router>
      <div className="App" style={{
        backgroundColor: '${project.theme?.backgroundColor || '#F9FAFB'}',
        color: '${project.theme?.textColor || '#111827'}',
        '--primary-color': '${project.theme?.primaryColor || '#10B981'}',
        '--secondary-color': '${project.theme?.secondaryColor || '#059669'}'
      }}>
        ${settings.includeAnalytics ? '<Analytics />' : ''}
${routesWrapper}
      </div>
    </Router>`;
  } else {
    const firstPage = pages[0];
    if (firstPage) {
      appContent = `    <div className="App" style={{
        backgroundColor: '${project.theme?.backgroundColor || '#F9FAFB'}',
        color: '${project.theme?.textColor || '#111827'}',
        '--primary-color': '${project.theme?.primaryColor || '#10B981'}',
        '--secondary-color': '${project.theme?.secondaryColor || '#059669'}'
      }}>
      ${settings.includeAnalytics ? '<Analytics />' : ''}
      <${capitalizeFirst(firstPage.name)}Page />
    </div>`;
    }
  }

  return `import React from 'react';
${routerImports}
${animationImports}
${analyticsImport}
${pageImports}
import ErrorBoundary from './ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
    <HelmetProvider>
${appContent}
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
`;
};

const generateMainCode = (settings: ExportSettings): string => {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
};

const addAccessibilityEnhancements = (code: string): string => {
  // Add basic accessibility improvements
  return code
    .replace(/<button/g, '<button type="button"')
    .replace(/<img([^>]*?)>/g, '<img$1 loading="lazy">')
    .replace(/className="([^"]*?)"/g, (match, classes) => {
      // Ensure focus states are included
      if (classes.includes('hover:') && !classes.includes('focus:')) {
        return `className="${classes} focus:outline-none focus:ring-2 focus:ring-offset-2"`;
      }
      return match;
    });
};

export { generatePageCode, generateAppCode, generateMainCode, generateComponentImports, generateComponentCode, addAccessibilityEnhancements };
