
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
    "ml-[17rem] flex-1 bg-[#1c1c1c] p-6 overflow-auto transition-all duration-300",
    {
      'max-w-[375px] mx-auto': state.previewMode === 'mobile',
      'max-w-[768px] mx-auto': state.previewMode === 'tablet',
      'w-full': state.previewMode === 'desktop',
    }
  );

  return (
    <div className={canvasClasses}>
      {/* Global theme CSS - single source of truth */}
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(state.theme) }} />
      <ResponsiveWrapper>
        <div className="bg-background min-h-full rounded-lg shadow-lg border border-gray-600 overflow-hidden editor-canvas">
          {currentPage?.components.length === 0 ? (
            <div className="flex bg-[#1c1c1c] items-center justify-center w-full h-[calc(100vh_-_7rem)]">
              <div className="text-center">
                <h3 className="text-lg text-white font-medium mb-2">Start Building</h3>
                <p className="text-sm text-white">Add components from the sidebar to get started</p>
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
