
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditableComponentRenderer } from './EditableComponentRenderer';
import { Component } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

interface DraggableComponentProps {
  component: Component;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? 'ring-2 ring-black ring-inset' : ''
        } hover:ring-1 hover:ring-gray-300 hover:ring-inset transition-all cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
    >
      <EditableComponentRenderer
        component={component}
        isSelected={isSelected}
      />

      {/* Drag handle and remove button */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
        <Button
          size="sm"
          variant="secondary"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(component.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isSelected && (
        <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs z-30">
          Selected: {component.category}
        </div>
      )}
    </div>
  );
};
