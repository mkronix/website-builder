
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditableComponentRenderer } from './EditableComponentRenderer';
import { Component } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Edit } from 'lucide-react';

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
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
        } transition-all cursor-pointer hover:ring-1 hover:ring-gray-400`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
    >
      <EditableComponentRenderer
        component={component}
        isSelected={isSelected}
      />

      {/* Improved hover controls with better positioning and accessibility */}
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-1 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            {...attributes}
            {...listeners}
            title="Drag to reorder"
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(component.id);
            }}
            title="Edit component"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(component.id);
            }}
            title="Delete component"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Selection overlay for better visual feedback */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#272725]/5 pointer-events-none rounded" />
      )}
    </div>
  );
};
