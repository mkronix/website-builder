
import { useEditor } from '@/contexts/EditorContext';
import { ComponentRenderer } from './ComponentRenderer';
import { ComponentCustomizer } from './ComponentCustomizer';
import { cn } from '@/lib/utils';

export const EditorCanvas = () => {
  const { state, selectComponent } = useEditor();
  
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
    <div className="flex flex-1 overflow-hidden">
      <div className={canvasClasses}>
        <div 
          className="bg-white min-h-full rounded-lg shadow-lg border border-gray-600 overflow-hidden"
          onClick={() => selectComponent(null)}
        >
          {currentPage?.components.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Start Building</h3>
                <p className="text-sm">Add components from the sidebar to get started</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600">
                    💡 Tip: Components can be dragged to reorder, and you can customize content and styling
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {currentPage?.components.map((component, index) => (
                <ComponentRenderer
                  key={component.id}
                  component={component}
                  isSelected={state.selectedComponent === component.id}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {state.selectedComponent && <ComponentCustomizer />}
    </div>
  );
};
