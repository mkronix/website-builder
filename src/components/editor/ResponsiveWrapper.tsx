
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
      }
      .responsive-container .grid-cols-2,
      .responsive-container .grid-cols-3,
      .responsive-container .grid-cols-4,
      .responsive-container .grid-cols-5,
      .responsive-container .grid-cols-6 {
        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
      }
      .responsive-container .flex-row {
        flex-direction: column !important;
      }
      .responsive-container .md\\:flex-row {
        flex-direction: column !important;
      }
      .responsive-container .lg\\:flex-row {
        flex-direction: column !important;
      }
      .responsive-container .text-4xl,
      .responsive-container .text-5xl,
      .responsive-container .text-6xl {
        font-size: 2rem !important;
        line-height: 2.5rem !important;
      }
      .responsive-container .text-3xl {
        font-size: 1.5rem !important;
        line-height: 2rem !important;
      }
      .responsive-container .p-8,
      .responsive-container .p-12,
      .responsive-container .p-16 {
        padding: 1rem !important;
      }
      .responsive-container .px-8,
      .responsive-container .px-12,
      .responsive-container .px-16 {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      .responsive-container .py-8,
      .responsive-container .py-12,
      .responsive-container .py-16 {
        padding-top: 1rem !important;
        padding-bottom: 1rem !important;
      }
      .responsive-container .gap-8,
      .responsive-container .gap-12 {
        gap: 1rem !important;
      }
      .responsive-container .space-x-8 > * + *,
      .responsive-container .space-x-12 > * + * {
        margin-left: 1rem !important;
      }
      .responsive-container .space-y-8 > * + *,
      .responsive-container .space-y-12 > * + * {
        margin-top: 1rem !important;
      }
      .responsive-container .hidden {
        display: none !important;
      }
      .responsive-container .md\\:block {
        display: none !important;
      }
      .responsive-container .lg\\:block {
        display: none !important;
      }
    ` : '';

    const tabletStyles = state.previewMode === 'tablet' ? `
      .responsive-container {
        max-width: 768px;
      }
      .responsive-container .grid-cols-3,
      .responsive-container .grid-cols-4,
      .responsive-container .grid-cols-5,
      .responsive-container .grid-cols-6 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .responsive-container .text-5xl,
      .responsive-container .text-6xl {
        font-size: 2.5rem !important;
        line-height: 3rem !important;
      }
      .responsive-container .text-4xl {
        font-size: 2rem !important;
        line-height: 2.5rem !important;
      }
      .responsive-container .p-12,
      .responsive-container .p-16 {
        padding: 2rem !important;
      }
      .responsive-container .px-12,
      .responsive-container .px-16 {
        padding-left: 2rem !important;
        padding-right: 2rem !important;
      }
      .responsive-container .py-12,
      .responsive-container .py-16 {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
      }
      .responsive-container .gap-12 {
        gap: 2rem !important;
      }
      .responsive-container .lg\\:block {
        display: none !important;
      }
    ` : '';

    const desktopStyles = state.previewMode === 'desktop' ? `
      .responsive-container {
        max-width: 100%;
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
