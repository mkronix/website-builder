
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

  return (
    <div className={cn(
      'transition-all duration-300',
      getResponsiveClasses(),
      className
    )}>
      {/* Responsive CSS only - no theme CSS injection here */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Responsive utilities for editor */
          .responsive-container {
            width: 100%;
            margin: 0 auto;
            transition: all 0.3s ease;
          }
          
          /* Mobile specific styles */
          ${state.previewMode === 'mobile' ? `
            .responsive-container {
              max-width: 375px;
            }
            .responsive-container .grid {
              grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            }
            .responsive-container .flex-row {
              flex-direction: column !important;
            }
            .responsive-container .text-4xl,
            .responsive-container .text-5xl,
            .responsive-container .text-6xl {
              font-size: 2rem !important;
              line-height: 2.5rem !important;
            }
            .responsive-container .p-8,
            .responsive-container .p-12,
            .responsive-container .p-16 {
              padding: 1rem !important;
            }
            .responsive-container .gap-8,
            .responsive-container .gap-12 {
              gap: 1rem !important;
            }
          ` : ''}
          
          /* Tablet specific styles */
          ${state.previewMode === 'tablet' ? `
            .responsive-container {
              max-width: 768px;
            }
            .responsive-container .grid-cols-3,
            .responsive-container .grid-cols-4 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            .responsive-container .text-5xl,
            .responsive-container .text-6xl {
              font-size: 2.5rem !important;
              line-height: 3rem !important;
            }
            .responsive-container .p-12,
            .responsive-container .p-16 {
              padding: 2rem !important;
            }
          ` : ''}
          
          /* Desktop styles */
          ${state.previewMode === 'desktop' ? `
            .responsive-container {
              max-width: 100%;
            }
          ` : ''}
        `
      }} />
      <div className="responsive-container">
        {children}
      </div>
    </div>
  );
};
