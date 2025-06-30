
import { useEditor } from '@/contexts/EditorContext';
import { DraggableComponent } from './DraggableComponent';
import { cn } from '@/lib/utils';
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
    </div>
  );
};
