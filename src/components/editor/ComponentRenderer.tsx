import React, { useMemo } from 'react';
import * as Babel from '@babel/standalone';
import { Component, useEditor } from '@/contexts/EditorContext';
import { renderStaticComponent } from '@/utils/compoenentRenderer';

interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected
}) => {
  const { selectComponent } = useEditor();

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


  const renderComponent = () => {
    if (DynamicComponent) {
      try {
        const result = DynamicComponent(React, component.default_props || {});
        if (React.isValidElement(result)) {
          return result;
        }
      } catch (error: any) {
        console.error('Error executing dynamic component:', error);
        return (
          <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
            <div className="font-semibold">Component Execution Error</div>
            <div className="text-sm mt-1">{error.message}</div>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs">Show component code</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-black text-xs overflow-auto max-h-32">
                {component.react_code}
              </pre>
            </details>
          </div>
        );
      }
    }

    return (
      <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
        <div className="font-semibold">Component Execution Error</div>
        <div className="text-sm mt-1">
          Unable to render component: {component.id}
        </div>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs">Show component code</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-black text-xs overflow-auto max-h-32">
            {component.react_code}
          </pre>
        </details>
      </div>
    )
    return renderStaticComponent(component);
  };

  return (
    <div
      className={`relative ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
        } hover:ring-1 hover:ring-gray-300 hover:ring-inset transition-all cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
    >
      {renderComponent()}
    </div>
  );
};
