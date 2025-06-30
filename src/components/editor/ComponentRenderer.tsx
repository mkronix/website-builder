
import React, { useMemo, useState } from 'react';
import * as Babel from '@babel/standalone';
import { Component, useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';

interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
  index: number;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  index
}) => {
  const { selectComponent, removeComponent, state, moveComponent } = useEditor();
  const [isDragging, setIsDragging] = useState(false);

  const DynamicComponent = useMemo(() => {
    if (!component.react_code) return null;

    try {
      let cleanCode = component.react_code
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
        .replace(/export\s+default\s+/, '')
        .trim();

      // Transpile JSX to JS using Babel
      const transpiledCode = Babel.transform(cleanCode, {
        presets: ['react'],
      }).code;

      // Extract the component function name using regex
      const match = transpiledCode.match(/function\s+([A-Za-z0-9_]+)/);
      if (!match || !match[1]) throw new Error('Unable to find component function name');

      const functionName = match[1];

      const wrappedCode = `
        const { useState, useEffect, useMemo, useCallback } = React;
        ${transpiledCode}
        ComponentFunc = ${functionName};
      `;

      const componentFunction = new Function('React', 'props', `
        let ComponentFunc;
        ${wrappedCode}
        return ComponentFunc(props);
      `);

      return componentFunction;
    } catch (error) {
      console.error('Error compiling component:', error);
      return null;
    }
  }, [component.react_code]);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = index;
    
    if (fromIndex !== toIndex) {
      moveComponent(state.currentPage, fromIndex, toIndex);
    }
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const renderComponent = () => {
    if (DynamicComponent) {
      try {
        // Merge default props with custom styling
        const customClasses = component.customTailwindClass || '';
        const baseClasses = component.default_props?.className || '';
        const combinedClasses = `${baseClasses} ${customClasses}`.trim();

        const mergedProps = {
          ...component.default_props,
          className: combinedClasses,
          style: component.customStyleCss ? 
            { ...component.default_props?.style, ...(component.customStyleCss || {}) } : 
            component.default_props?.style
        };

        const result = DynamicComponent(React, mergedProps);
        if (React.isValidElement(result)) {
          return result;
        }
      } catch (error: any) {
        console.error('Error executing dynamic component:', error);
        return (
          <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
            <div className="font-semibold">Component Execution Error</div>
            <div className="text-sm mt-1">{error.message}</div>
          </div>
        );
      }
    }

    return (
      <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
        <div className="font-semibold">Component Execution Error</div>
        <div className="text-sm mt-1">Unable to render component: {component.id}</div>
      </div>
    );
  };

  return (
    <div
      className={`relative group ${isDragging ? 'opacity-50' : ''} ${
        isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
      } hover:ring-1 hover:ring-gray-300 hover:ring-inset transition-all`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
    >
      {/* Component Controls */}
      {isSelected && (
        <div className="absolute top-2 right-2 flex gap-2 z-20 bg-black/80 rounded p-1">
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {component.category}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              removeComponent(state.currentPage, component.id);
            }}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <div className="cursor-move text-gray-400 hover:text-white p-1">
            <GripVertical className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Render Component */}
      <div className="relative">
        {renderComponent()}
      </div>
    </div>
  );
};
