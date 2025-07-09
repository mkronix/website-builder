
import { useEditor } from '@/contexts/EditorContext';
import { DraggableComponent } from './DraggableComponent';
import { ResponsiveWrapper } from './ResponsiveWrapper';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';
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

// Enhanced theme CSS generation for proper theme integration
const generateThemeCSS = (theme: any) => {
  const primaryHover = adjustColorBrightness(theme.primary_color || '#10B981', -0.1);
  const secondaryHover = adjustColorBrightness(theme.secondary_color || '#059669', -0.1);

  return `
    :root {
      --theme-primary: ${theme.primary_color || '#10B981'};
      --theme-secondary: ${theme.secondary_color || '#059669'};
      --theme-background: ${theme.background || '#FFFFFF'};
      --theme-text: ${theme.text_primary || '#1F2937'};
      --theme-muted: ${adjustColorOpacity(theme.primary_color || '#10B981', 0.7)};
      --theme-muted-foreground: ${adjustColorOpacity(theme.text_primary || '#1F2937', 0.5)};
      --theme-primary-hover: ${primaryHover};
      --theme-secondary-hover: ${secondaryHover};
    }
    
    .editor-canvas {
      --tw-primary: var(--theme-primary);
      --tw-secondary: var(--theme-secondary);
      --tw-background: var(--theme-background);
      --tw-text: var(--theme-text);
      
      /* Enhanced background and text theming */
      background-color: var(--theme-background);
      color: var(--theme-text);
    }

    /* Comprehensive theme integration for all components */
    .editor-canvas * {
      transition: all 0.2s ease-in-out;
    }

    /* Theme-aware component styling */
    .editor-canvas .bg-primary,
    .editor-canvas [data-theme-element="primary-bg"] { 
      background-color: var(--theme-primary) !important; 
    }
    .editor-canvas .bg-secondary,
    .editor-canvas [data-theme-element="secondary-bg"] { 
      background-color: var(--theme-secondary) !important; 
    }
    .editor-canvas .bg-background,
    .editor-canvas [data-theme-element="background"] { 
      background-color: var(--theme-background) !important; 
    }
    .editor-canvas .text-primary,
    .editor-canvas [data-theme-element="primary-text"] { 
      color: var(--theme-primary) !important; 
    }
    .editor-canvas .text-secondary,
    .editor-canvas [data-theme-element="secondary-text"] { 
      color: var(--theme-secondary) !important; 
    }
    .editor-canvas .text-foreground,
    .editor-canvas [data-theme-element="text"] { 
      color: var(--theme-text) !important; 
    }
    
    /* Enhanced button theming */
    .editor-canvas button:not([class*="bg-"]) {
      background-color: var(--theme-primary);
      color: var(--theme-background);
    }
    .editor-canvas button:not([class*="bg-"]):hover {
      background-color: var(--theme-primary-hover);
    }
    
    /* Enhanced link theming */
    .editor-canvas a:not([class*="text-"]) {
      color: var(--theme-primary);
    }
    .editor-canvas a:not([class*="text-"]):hover {
      color: var(--theme-primary-hover);
    }
    
    /* Form element theming */
    .editor-canvas input:not([class*="bg-"]),
    .editor-canvas textarea:not([class*="bg-"]),
    .editor-canvas select:not([class*="bg-"]) {
      background-color: var(--theme-background);
      color: var(--theme-text);
      border-color: var(--theme-secondary);
    }
    
    .editor-canvas input:focus:not([class*="ring-"]),
    .editor-canvas textarea:focus:not([class*="ring-"]),
    .editor-canvas select:focus:not([class*="ring-"]) {
      ring-color: var(--theme-primary);
      border-color: var(--theme-primary);
    }
  `;
};

// Helper functions for color manipulation
const adjustColorBrightness = (color: string, amount: number): string => {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + Math.round(255 * amount)));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * amount)));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + Math.round(255 * amount)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
  return color;
};

const adjustColorOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

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
      {/* Enhanced theme CSS injection with proper cascade */}
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(state.theme) }} />

      <ResponsiveWrapper>
        <div
          className="bg-background min-h-full rounded-lg shadow-2xl border border-gray-600 overflow-hidden editor-canvas"
          style={{
            backgroundColor: state.theme.backgroundColor || '#FFFFFF',
            color: state.theme.textColor || '#1F2937'
          }}
        >
          {currentPage?.components.length === 0 ? (
            <div className="flex bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] items-center justify-center w-full h-[calc(100vh_-_8rem)] border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
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

