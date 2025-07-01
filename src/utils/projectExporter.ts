import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Component, ExportSettings, Page, Project, ProjectData } from './projectExporterTypes';
import { capitalizeFirst, createDefaultOGImage, createFaviconData, createViteSvg, getComponentName, slugify } from './projectExporterUtils';
import { generateAppCode, generateComponentCode, generateMainCode, generatePageCode } from './projectExporterCodeGenerator';
import { generateSEOTags } from './projectExporterSeoUtils';

export const exportProject = async (
  projectData: ProjectData,
  selectedComponents: Component[] = [],
  settings: ExportSettings = {
    includeAnimations: true,
    includeRouting: true,
    typescript: false,
    prettier: true,
    includeSEO: true,
    includeAnalytics: false,
    includeSitemap: true,
    includeRobots: true
  }
): Promise<void> => {
  try {
    const zip = new JSZip();
    const { project, pages } = projectData;

    // Filter pages and components
    const filteredPages = pages.filter(page =>
      selectedComponents.some(comp =>
        page.components.some(pageComp => pageComp.id === comp.id)
      )
    );

    // Create project structure
    await createProjectStructure(zip, project, filteredPages, selectedComponents, settings);

    // Generate and download ZIP
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    const fileName = `${slugify(project.name || 'react-project')}.zip`;
    saveAs(content, fileName);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


const createProjectStructure = async (
  zip: JSZip,
  project: Project,
  pages: Page[],
  selectedComponents: Component[],
  settings: ExportSettings
): Promise<void> => {
  // Public folder with SEO assets
  createPublicFolder(zip, project, settings);

  // Source folder structure
  const srcFolder = zip.folder('src');

  // Create components
  createComponents(srcFolder, selectedComponents, settings);

  // Create pages with SEO
  createPages(srcFolder, pages, selectedComponents, settings, project);

  // Create main app files
  createAppFiles(srcFolder, pages, project, settings);

  // Create utils and hooks
  createUtilsAndHooks(srcFolder, settings);

  // Create SEO components
  if (settings.includeSEO) {
    createSEOComponents(srcFolder, settings);
  }

  // Create index.html with proper SEO
  createIndexPage(zip, project, pages[0], settings);

  // Root configuration files
  createConfigFiles(zip, project, settings);

  // SEO files
  if (settings.includeSEO) {
    createSEOFiles(zip, project, pages, settings);
  }
};

const createPublicFolder = (zip: JSZip, project: Project, settings: ExportSettings): void => {
  const publicFolder = zip.folder('public');

  // Vite SVG
  publicFolder.file('vite.svg', createViteSvg());

  // Favicon files
  publicFolder.file('favicon.ico', createFaviconData());
  publicFolder.file('favicon-16x16.png', createFaviconData());
  publicFolder.file('favicon-32x32.png', createFaviconData());
  publicFolder.file('apple-touch-icon.png', createFaviconData());

  // Default OG image
  publicFolder.file('og-image.jpg', createDefaultOGImage());

  // Robots.txt
  if (settings.includeRobots) {
    publicFolder.file('robots.txt', generateRobotsTxt(project));
  }

  // Manifest for PWA
  publicFolder.file('manifest.json', generateManifest(project));
};

const createSEOComponents = (srcFolder: JSZip, settings: ExportSettings): void => {
  const seoFolder = srcFolder.folder('components').folder('seo');

  // SEO Head component
  seoFolder.file('SEOHead.jsx', generateSEOHeadComponent());

  // Schema markup component
  seoFolder.file('SchemaMarkup.jsx', generateSchemaMarkupComponent());

  // Analytics component
  if (settings.includeAnalytics) {
    seoFolder.file('Analytics.jsx', generateAnalyticsComponent());
  }
};

const createIndexPage = (zip: JSZip, project: Project, firstPage: Page, settings: ExportSettings): void => {
  const seoTags = settings.includeSEO && firstPage ? generateSEOTags(firstPage, project) : '';

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${seoTags || `<title>${project.name || 'React App'}</title>`}
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- DNS prefetch for external resources -->
    <link rel="dns-prefetch" href="//www.google-analytics.com">
    
    ${settings.includeAnalytics ? `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    ` : ''}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

  zip.file('index.html', indexHtml);
};

const createComponents = (
  srcFolder: JSZip,
  selectedComponents: Component[],
  settings: ExportSettings
): void => {
  const componentsFolder = srcFolder.folder('components');

  // Group components by category
  const componentsByCategory = selectedComponents.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, Component[]>);

  // Create category folders and component files
  Object.entries(componentsByCategory).forEach(([category, components]) => {
    const categoryFolder = componentsFolder.folder(category);

    components.forEach(component => {
      const componentName = getComponentName(component.react_code);
      const fileName = `${componentName}.jsx`;
      const componentCode = generateComponentCode(component, settings);
      categoryFolder.file(fileName, componentCode);
    });
  });

  // Create index file for easy imports
  const indexContent = generateComponentsIndex(componentsByCategory);
  componentsFolder.file('index.js', indexContent);
};

const createPages = (
  srcFolder: JSZip,
  pages: Page[],
  selectedComponents: Component[],
  settings: ExportSettings,
  project: Project
): void => {
  const pagesFolder = srcFolder.folder('pages');

  pages.forEach(page => {
    const pageComponents = page.components.filter(comp =>
      selectedComponents.some(selected => selected.id === comp.id)
    );

    if (pageComponents.length > 0) {
      const pageCode = generatePageCode(page, pageComponents, settings, project);
      const fileName = `${capitalizeFirst(page.name)}.jsx`;
      pagesFolder.file(fileName, pageCode);
    }
  });

  // Create pages index
  const pagesIndexContent = generatePagesIndex(pages);
  pagesFolder.file('index.js', pagesIndexContent);
};

const createAppFiles = (
  srcFolder: JSZip,
  pages: Page[],
  project: Project,
  settings: ExportSettings
): void => {
  // App.jsx with error boundary
  const appCode = generateAppCode(pages, project, settings);
  srcFolder.file('App.jsx', appCode);

  // main.jsx with error handling
  const mainCode = generateMainCode(settings);
  srcFolder.file('main.jsx', mainCode);

  // App.css with optimized styles
  const appCss = generateAppCSS();
  srcFolder.file('App.css', appCss);

  // index.css with Tailwind and custom styles
  const indexCss = generateIndexCSS();
  srcFolder.file('index.css', indexCss);

  // Error boundary component
  srcFolder.file('ErrorBoundary.jsx', generateErrorBoundary());
};

const createUtilsAndHooks = (srcFolder: JSZip, settings: ExportSettings): void => {
  const utilsFolder = srcFolder.folder('utils');
  const hooksFolder = srcFolder.folder('hooks');

  // Create utility functions
  utilsFolder.file('cn.js', generateCnUtil());
  utilsFolder.file('seo.js', generateSEOUtils());

  if (settings.includeAnimations) {
    utilsFolder.file('animations.js', generateAnimationsUtil());
  }

  // Create custom hooks
  if (settings.includeRouting) {
    hooksFolder.file('usePageTransition.js', generatePageTransitionHook());
  }

  if (settings.includeSEO) {
    hooksFolder.file('useSEO.js', generateSEOHook());
  }

  hooksFolder.file('index.js', generateHooksIndex(settings));
};

const createSEOFiles = (
  zip: JSZip,
  project: Project,
  pages: Page[],
  settings: ExportSettings
): void => {
  // Sitemap
  if (settings.includeSitemap) {
    zip.file('public/sitemap.xml', generateSitemap(project, pages));
  }

  // SEO config
  const srcFolder = zip.folder('src');
  srcFolder.file('config/seo.js', generateSEOConfig(project));
};

const generateSEOHeadComponent = (): string => {
  return `import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage, 
  canonical,
  noindex = false 
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
    </Helmet>
  );
};`;
};

const generateSchemaMarkupComponent = (): string => {
  return `import React from 'react';

export const SchemaMarkup = ({ type, name, description, url, logo, ...props }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name,
    "description": description,
    "url": url,
    ...props
  };

  if (logo) {
    schemaData.logo = logo;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};`;
};

const generateAnalyticsComponent = (): string => {
  return `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics page view tracking
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

export default Analytics;`;
};

const generateErrorBoundary = (): string => {
  return `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`;
};

const generateSEOUtils = (): string => {
  return `export const generateMetaTags = (seoData) => {
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords?.join(', ') || '',
    ogImage: seoData.ogImage || '/og-image.jpg',
    canonical: seoData.canonical
  };
};

export const structuredData = {
  website: (data) => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": data.name,
    "url": data.url,
    "description": data.description
  }),
  
  organization: (data) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "url": data.url,
    "logo": data.logo,
    "description": data.description
  })
};`;
};

const generateManifest = (project: Project): string => {
  return JSON.stringify({
    name: project.name || 'React App',
    short_name: project.name || 'React App',
    description: project.description || 'A modern React application',
    start_url: '/',
    display: 'standalone',
    theme_color: project.theme?.primaryColor || '#000000',
    background_color: project.theme?.backgroundColor || '#ffffff',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  }, null, 2);
};

const generateSEOConfig = (project: Project): string => {
  return `export const seoConfig = {
  defaultTitle: '${project.name || 'React App'}',
  titleTemplate: '%s | ${project.name || 'React App'}',
  defaultDescription: '${project.seo?.defaultDescription || project.description || ''}',
  siteUrl: 'https://yoursite.com', // Configure this
  siteName: '${project.seo?.siteName || project.name || 'React App'}',
  author: '${project.seo?.author || ''}',
  twitterHandle: '${project.seo?.twitterHandle || ''}',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    siteName: '${project.seo?.siteName || project.name || 'React App'}',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '${project.name || 'React App'} - Open Graph Image'
      }
    ]
  },
  
  twitter: {
    handle: '${project.seo?.twitterHandle || ''}',
    site: '${project.seo?.twitterHandle || ''}',
    cardType: 'summary_large_image'
  }
};`;
};
const generateSEOHook = (): string => {
  return `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSEO = (seoData) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && seoData.description) {
      metaDescription.setAttribute('content', seoData.description);
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.origin + location.pathname);
    }
  }, [location, seoData]);
};`;
};

const generateSitemap = (project: Project, pages: Page[]): string => {
  const baseUrl = 'https://yoursite.com'; // This should be configurable
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = pages.map(page => `
  <url>
    <loc>${baseUrl}${page.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.slug === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

const generateRobotsTxt = (project: Project): string => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://yoursite.com/sitemap.xml

# Block access to admin areas (if any)
Disallow: /admin/
Disallow: /private/

# Allow all web crawlers access to CSS and JS files
Allow: /*.css$
Allow: /*.js// Enhanced SEO-Optimized Project Exporter`
}
const createConfigFiles = (zip: JSZip, project: Project, settings: ExportSettings): void => {
  // package.json
  const packageJson = generatePackageJson(project, settings);
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // tailwind.config.js
  const tailwindConfig = generateTailwindConfig();
  zip.file('tailwind.config.js', tailwindConfig);

  // postcss.config.js
  const postcssConfig = generatePostCSSConfig();
  zip.file('postcss.config.js', postcssConfig);

  // vite.config.js
  const viteConfig = generateViteConfig();
  zip.file('vite.config.js', viteConfig);

  // jsconfig.json (for JS projects)
  const jsConfig = generateJSConfig();
  zip.file('jsconfig.json', JSON.stringify(jsConfig, null, 2));

  // .gitignore
  const gitignore = generateGitignore();
  zip.file('.gitignore', gitignore);

  // README.md
  const readme = generateReadme(project, settings);
  zip.file('README.md', readme);

  // .eslintrc.js
  const eslintConfig = generateEslintConfig();
  zip.file('.eslintrc.js', eslintConfig);

  if (settings.prettier) {
    // .prettierrc
    const prettierConfig = generatePrettierConfig();
    zip.file('.prettierrc', JSON.stringify(prettierConfig, null, 2));

    // .prettierignore
    const prettierIgnore = generatePrettierIgnore();
    zip.file('.prettierignore', prettierIgnore);
  }
};

const generatePackageJson = (project: Project, settings: ExportSettings): Record<string, any> => {
  const baseDependencies = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    'clsx': '^2.0.0',
    'tailwind-merge': '^2.2.0'
  };

  const conditionalDependencies: Record<string, string> = {};

  if (settings.includeRouting) {
    conditionalDependencies['react-router-dom'] = '^6.8.1';
  }

  if (settings.includeAnimations) {
    conditionalDependencies['framer-motion'] = '^10.16.16';
  }

  const baseDevDependencies = {
    '@vitejs/plugin-react': '^4.2.1',
    autoprefixer: '^10.4.16',
    eslint: '^8.55.0',
    'eslint-plugin-react': '^7.33.2',
    'eslint-plugin-react-hooks': '^4.6.0',
    'eslint-plugin-react-refresh': '^0.4.5',
    postcss: '^8.4.32',
    tailwindcss: '^3.4.0',
    vite: '^5.0.8'
  };

  const conditionalDevDependencies: Record<string, string> = {};

  if (settings.prettier) {
    conditionalDevDependencies.prettier = '^3.0.0';
    conditionalDevDependencies['eslint-config-prettier'] = '^9.0.0';
    conditionalDevDependencies['eslint-plugin-prettier'] = '^5.0.0';
  }

  return {
    name: project.name || 'react-project',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      lint: 'eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0',
      preview: 'vite preview',
      ...(settings.prettier && { format: 'prettier --write "src/**/*.{js,jsx,css,md}"' })
    },
    dependencies: { ...baseDependencies, ...conditionalDependencies },
    devDependencies: { ...baseDevDependencies, ...conditionalDevDependencies }
  };
};

const generateTailwindConfig = (): string => {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}`;
};

const generatePostCSSConfig = (): string => {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
};

const generateViteConfig = (): string => {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})`;
};

const generateJSConfig = (): Record<string, any> => {
  return {
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: false,
      resolveJsonModule: true,
      isolatedModules: false,
      noEmit: true,
      jsx: 'react-jsx',
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['src'],
    exclude: ['node_modules']
  };
};

const generateIndexCSS = (): string => {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  width: 100%;
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors;
  }
  
  .btn-secondary {
    @apply border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors;
  }
}`;
};

const generateAppCSS = (): string => {
  return `#root {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.App {
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}`;
};

const generateCnUtil = (): string => {
  return `import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}`;
};

const generateAnimationsUtil = (): string => {
  return `export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const slideInLeft = {
  initial: {
    opacity: 0,
    x: -60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const slideInRight = {
  initial: {
    opacity: 0,
    x: 60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};`;
};

const generatePageTransitionHook = (): string => {
  return `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return location;
};`;
};

const generateHooksIndex = (settings: ExportSettings): string => {
  const exports = [];

  if (settings.includeRouting) {
    exports.push(`export { usePageTransition } from './usePageTransition';`);
  }

  return exports.join('\n');
};

const generateComponentsIndex = (componentsByCategory: Record<string, Component[]>): string => {
  const exports: string[] = [];

  Object.entries(componentsByCategory).forEach(([category, components]) => {
    components.forEach(component => {
      const componentName = getComponentName(component.react_code);
      exports.push(`export { default as ${componentName} } from './${category}/${componentName}';`);
    });
  });

  return exports.join('\n');
};

const generatePagesIndex = (pages: Page[]): string => {
  return pages.map(page =>
    `export { default as ${capitalizeFirst(page.name)}Page } from './${capitalizeFirst(page.name)}';`
  ).join('\n');
};

const generateEslintConfig = (): string => {
  return `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
  },
}`;
};

const generatePrettierConfig = (): Record<string, any> => {
  return {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false
  };
};

const generatePrettierIgnore = (): string => {
  return `# Ignore artifacts:
build
coverage
dist
node_modules

# Ignore all HTML files:
*.html

# Ignore config files
.eslintrc.js
vite.config.js
tailwind.config.js
postcss.config.js`;
};

const generateGitignore = (): string => {
  return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`;
};

const generateReadme = (project: Project, settings: ExportSettings): string => {
  const features = [
    '⚡️ **Vite** - Lightning fast build tool',
    '⚛️ **React 18** - Latest React features',
    '🎨 **TailwindCSS** - Utility-first CSS framework',
    '📱 **Responsive Design** - Mobile-first approach'
  ];

  if (settings.includeAnimations) {
    features.push('🎭 **Framer Motion** - Production-ready motion library');
  }

  if (settings.includeRouting) {
    features.push('🛣️ **React Router DOM** - Declarative routing');
  }

  if (settings.prettier) {
    features.push('💅 **Prettier** - Code formatting');
  }

  const scripts = [
    '- `npm run dev` - Start development server',
    '- `npm run build` - Build for production',
    '- `npm run preview` - Preview production build',
    '- `npm run lint` - Run ESLint'
  ];

  if (settings.prettier) {
    scripts.push('- `npm run format` - Format code with Prettier');
  }

  return `# ${project.name || 'React Project'}

${project.description || 'A modern React application built with Vite, TailwindCSS, and modern web technologies.'}

## Features

${features.join('\n')}

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Extract the project files to your desired location

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Available Scripts

${scripts.join('\n')}

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── navbar/         # Navigation components
│   ├── hero/           # Hero section components
│   ├── services/       # Service components
│   └── contact/        # Contact components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.jsx             # Main App component
└── main.jsx            # Application entry point
\`\`\`

## Customization

### Theme Colors

The project uses CSS custom properties for theming. You can modify the colors in:
- \`tailwind.config.js\` - For Tailwind utilities
- \`App.jsx\` - For CSS custom properties

### Adding New Components

1. Create component in appropriate category folder under \`src/components/\`
2. Export from \`src/components/index.js\`
3. Import and use in your pages

### Adding New Pages

1. Create page component in \`src/pages/\`
${settings.includeRouting ? '2. Add route in `App.jsx`\n3. Export from `src/pages/index.js`' : '2. Export from `src/pages/index.js`'}
`;


};
