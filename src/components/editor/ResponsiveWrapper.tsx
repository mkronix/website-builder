
import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className
}) => {
  const { state } = useEditor();

  const getResponsiveClasses = () => {
    switch (state.previewMode) {
      case 'mobile':
        return 'max-w-[375px] mx-auto';
      case 'tablet':
        return 'max-w-[768px] mx-auto';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  const getResponsiveStyles = () => {
    const baseStyles = `
      .responsive-container {
        width: 100%;
        margin: 0 auto;
        transition: all 0.3s ease;
      }
    `;

    const mobileStyles = state.previewMode === 'mobile' ? `
      .responsive-container {
        max-width: 375px;
        padding: 0 1rem;
      }
      /* Grid System - Mobile First */
      .responsive-container .grid-cols-2,
      .responsive-container .grid-cols-3,
      .responsive-container .grid-cols-4,
      .responsive-container .grid-cols-5,
      .responsive-container .grid-cols-6 {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      /* Flex Direction - Mobile Stack */
      .responsive-container .flex-row,
      .responsive-container .md\\:flex-row,
      .responsive-container .lg\\:flex-row {
        flex-direction: column !important;
      }
      /* Typography - Mobile Scaling */
      .responsive-container .text-6xl,
      .responsive-container .text-5xl {
        font-size: 2rem !important;
        line-height: 2.25rem !important;
      }
      .responsive-container .text-4xl {
        font-size: 1.75rem !important;
        line-height: 2rem !important;
      }
      .responsive-container .text-3xl {
        font-size: 1.5rem !important;
        line-height: 1.75rem !important;
      }
      .responsive-container .text-2xl {
        font-size: 1.25rem !important;
        line-height: 1.5rem !important;
      }
      /* Spacing - Mobile Compact */
      .responsive-container .p-16,
      .responsive-container .p-12,
      .responsive-container .p-10,
      .responsive-container .p-8 {
        padding: 1rem !important;
      }
      .responsive-container .px-16,
      .responsive-container .px-12,
      .responsive-container .px-10,
      .responsive-container .px-8 {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      .responsive-container .py-16,
      .responsive-container .py-12,
      .responsive-container .py-10,
      .responsive-container .py-8 {
        padding-top: 1rem !important;
        padding-bottom: 1rem !important;
      }
      .responsive-container .gap-12,
      .responsive-container .gap-10,
      .responsive-container .gap-8 {
        gap: 1rem !important;
      }
      .responsive-container .space-x-12 > * + *,
      .responsive-container .space-x-10 > * + *,
      .responsive-container .space-x-8 > * + * {
        margin-left: 1rem !important;
      }
      .responsive-container .space-y-12 > * + *,
      .responsive-container .space-y-10 > * + *,
      .responsive-container .space-y-8 > * + * {
        margin-top: 1rem !important;
      }
      /* Margins - Mobile Compact */
      .responsive-container .m-16,
      .responsive-container .m-12,
      .responsive-container .m-10,
      .responsive-container .m-8 {
        margin: 1rem !important;
      }
      .responsive-container .mx-16,
      .responsive-container .mx-12,
      .responsive-container .mx-10,
      .responsive-container .mx-8 {
        margin-left: 1rem !important;
        margin-right: 1rem !important;
      }
      .responsive-container .my-16,
      .responsive-container .my-12,
      .responsive-container .my-10,
      .responsive-container .my-8 {
        margin-top: 1rem !important;
        margin-bottom: 1rem !important;
      }
      /* Component Specific - Mobile Adjustments */
      .responsive-container .aspect-video {
        aspect-ratio: 16/9 !important;
      }
      .responsive-container .aspect-square {
        aspect-ratio: 1/1 !important;
      }
      /* Buttons - Mobile Full Width */
      .responsive-container .btn-group {
        flex-direction: column !important;
        width: 100% !important;
      }
      .responsive-container .btn-group > * {
        width: 100% !important;
        margin-bottom: 0.5rem !important;
      }
      /* Navigation - Mobile Adjustments */
      .responsive-container .nav-horizontal {
        flex-direction: column !important;
      }
      .responsive-container .nav-horizontal > * {
        width: 100% !important;
        text-align: center !important;
      }
      /* Cards - Mobile Stack */
      .responsive-container .card-grid {
        grid-template-columns: 1fr !important;
      }
      /* Images - Mobile Responsive */
      .responsive-container img {
        max-width: 100% !important;
        height: auto !important;
      }
      /* Hide Elements on Mobile */
      .responsive-container .hidden-mobile {
        display: none !important;
      }
      .responsive-container .md\\:block,
      .responsive-container .lg\\:block {
        display: none !important;
      }
    ` : '';

    const tabletStyles = state.previewMode === 'tablet' ? `
      .responsive-container {
        max-width: 768px;
        padding: 0 1.5rem;
      }
      /* Grid System - Tablet */
      .responsive-container .grid-cols-4,
      .responsive-container .grid-cols-5,
      .responsive-container .grid-cols-6 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .responsive-container .grid-cols-3 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      /* Typography - Tablet Scaling */
      .responsive-container .text-6xl,
      .responsive-container .text-5xl {
        font-size: 2.5rem !important;
        line-height: 2.75rem !important;
      }
      .responsive-container .text-4xl {
        font-size: 2rem !important;
        line-height: 2.25rem !important;
      }
      /* Spacing - Tablet Medium */
      .responsive-container .p-16,
      .responsive-container .p-12 {
        padding: 2rem !important;
      }
      .responsive-container .px-16,
      .responsive-container .px-12 {
        padding-left: 2rem !important;
        padding-right: 2rem !important;
      }
      .responsive-container .py-16,
      .responsive-container .py-12 {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
      }
      .responsive-container .gap-12 {
        gap: 2rem !important;
      }
      /* Buttons - Tablet Adjustments */
      .responsive-container .btn-group {
        flex-direction: row !important;
        flex-wrap: wrap !important;
      }
      /* Navigation - Tablet Adjustments */
      .responsive-container .nav-horizontal {
        flex-direction: row !important;
        justify-content: center !important;
      }
      /* Hide Large Screen Elements */
      .responsive-container .lg\\:block {
        display: none !important;
      }
    ` : '';

    const desktopStyles = state.previewMode === 'desktop' ? `
      .responsive-container {
        max-width: 100%;
        padding: 0 2rem;
      }
      /* Desktop - Full Functionality */
      .responsive-container .grid-responsive {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
      }
    ` : '';

    return baseStyles + mobileStyles + tabletStyles + desktopStyles;
  };

  return (
    <div className={cn(
      'transition-all duration-300',
      getResponsiveClasses(),
      className
    )}>
      <style dangerouslySetInnerHTML={{
        __html: getResponsiveStyles()
      }} />
      <div className="responsive-container">
        {children}
      </div>
    </div>
  );
};
