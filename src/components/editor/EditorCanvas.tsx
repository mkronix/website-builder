
import { useEditor } from '@/contexts/EditorContext';
import { DraggableComponent } from './DraggableComponent';
import { ResponsiveWrapper } from './ResponsiveWrapper';
import { cn } from '@/lib/utils';
import { generateThemeCSS } from '@/utils/themeUtils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const EditorCanvas = () => {
  const { state, selectComponent, removeComponent, updatePage } = useEditor();

  const currentPage = state.pages.find(page => page.id === state.currentPage);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && currentPage) {
      const oldIndex = currentPage.components.findIndex(comp => comp.id === active.id);
      const newIndex = currentPage.components.findIndex(comp => comp.id === over?.id);

      const newComponents = arrayMove(currentPage.components, oldIndex, newIndex);
      updatePage(currentPage.id, { components: newComponents });
    }
  };

  const handleRemoveComponent = (componentId: string) => {
    if (currentPage) {
      removeComponent(currentPage.id, componentId);
    }
  };

  const canvasClasses = cn(
    "flex-1 bg-gradient-to-br from-[#1c1c1c] via-[#1a1a1a] to-[#222222] p-3 sm:p-6 overflow-auto transition-all duration-300",
    "ml-0 sm:ml-[17rem]",
    {
      'max-w-[375px] mx-auto': state.previewMode === 'mobile',
      'max-w-[768px] mx-auto': state.previewMode === 'tablet',
      'w-full': state.previewMode === 'desktop',
    }
  );

  return (
    <div className={canvasClasses}>
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(state.theme) }} />
      <ResponsiveWrapper>
        <div className="bg-background min-h-full rounded-lg shadow-2xl border border-gray-600 overflow-hidden editor-canvas">
          {currentPage?.components.length === 0 ? (
            <div className="flex bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] items-center justify-center w-full h-[calc(100vh_-_8rem)] border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Start Building</h3>
                <p className="text-sm text-gray-400 max-w-xs">Add components from the sidebar to get started with your design</p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentPage?.components.map(comp => comp.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-0">
                  {currentPage?.components.map((component) => (
                    <DraggableComponent
                      key={component.id}
                      component={component}
                      isSelected={state.selectedComponent === component.id}
                      onSelect={selectComponent}
                      onRemove={handleRemoveComponent}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </ResponsiveWrapper>
    </div>
  );
};
