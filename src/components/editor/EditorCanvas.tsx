
import { useEditor } from '@/contexts/EditorContext';
import { ComponentRenderer } from './ComponentRenderer';
import { cn } from '@/lib/utils';

export const EditorCanvas = () => {
  const { state } = useEditor();
  
  const currentPage = state.pages.find(page => page.id === state.currentPage);
  
  const canvasClasses = cn(
    "flex-1 bg-[#1c1c1c] p-6 overflow-auto transition-all duration-300",
    {
      'max-w-[375px] mx-auto': state.previewMode === 'mobile',
      'max-w-[768px] mx-auto': state.previewMode === 'tablet',
      'w-full': state.previewMode === 'desktop',
    }
  );

  return (
    <div className={canvasClasses}>
      <div className="bg-white min-h-full rounded-lg shadow-lg border border-gray-600 overflow-hidden">
        {currentPage?.components.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Start Building</h3>
              <p className="text-sm">Add components from the sidebar to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {currentPage?.components.map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                isSelected={state.selectedComponent === component.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
