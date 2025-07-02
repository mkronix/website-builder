
import { Page, Project } from "./projectExporterTypes";

export const generateSEOTags = (page: Page, project: Project): string => {
    const projectSeo = project.settings?.seo || {};
    const pageTitle = page.seo?.title || projectSeo.title || `${page.name} | ${project.name}`;
    const pageDescription = page.seo?.description || projectSeo.description || project.description || '';
    const siteName = projectSeo.siteName || project.name;
    const author = projectSeo.author || '';
    const twitterHandle = projectSeo.twitterHandle || '';
    const keywords = page.seo?.keywords?.join(', ') || projectSeo.keywords?.join(', ') || '';
    const ogImage = page.seo?.ogImage || projectSeo.ogImage || '/og-image.jpg';

    return `
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDescription}" />
    ${keywords && `<meta name="keywords" content="${keywords}" />`}
    ${author && `<meta name="author" content="${author}" />`}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${page.slug}" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${pageDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="${siteName}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${page.slug}" />
    <meta property="twitter:title" content="${pageTitle}" />
    <meta property="twitter:description" content="${pageDescription}" />
    <meta property="twitter:image" content="${ogImage}" />
    ${twitterHandle && `<meta property="twitter:site" content="${twitterHandle.startsWith('@') ? twitterHandle : '@' + twitterHandle}" />`}
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="${project.theme?.primaryColor || '#000000'}" />
    <link rel="canonical" href="${page.slug}" />
  `.trim();
};
