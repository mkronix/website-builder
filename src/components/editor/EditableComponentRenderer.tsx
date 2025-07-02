import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Component, useEditor } from '@/contexts/EditorContext';
import { applyThemeToCode, generateThemeCSS } from '@/utils/themeUtils';
import * as Babel from '@babel/standalone';
import React, { useMemo, useRef, useState } from 'react';
import StyleEditor from './StyleEditor';
import ContentEditor from './ContentEditor';
import { DynamicFieldEditor } from './DynamicFieldEditor';
import { SmartArrayCRUD } from './SmartArrayCRUD';

interface EditableComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

// Helper function to normalize props from old to new format
const normalizeProps = (props: any): any => {
  if (!props) return {};

  const normalized: any = {};

  Object.entries(props).forEach(([key, value]: [string, any]) => {
    if (value && typeof value === 'object') {
      // Check if it's already in new format (has type, value, tailwindCss)
      if (value.type && (value.value !== undefined || value.tailwindCss)) {
        normalized[key] = value;
      }
      // Check if it's an array of objects
      else if (Array.isArray(value)) {
        // Check if array items are in new format
        if (value.length > 0 && value[0].tailwindCss !== undefined) {
          normalized[key] = {
            type: 'array',
            value: value,
            tailwindCss: '',
            customCss: {}
          };
        } else {
          // Convert old array format to new format
          normalized[key] = {
            type: 'array',
            value: value.map(item => ({
              ...item,
              tailwindCss: item.tailwindCss || '',
              customCss: item.customCss || {}
            })),
            tailwindCss: '',
            customCss: {}
          };
        }
      }
      // Check if it's a nested object (like contact_button, hero_image)
      else if (value.text || value.src || value.href || value.email) {
        normalized[key] = {
          type: 'object',
          value: {
            ...value,
            tailwindCss: value.tailwindCss || '',
            customCss: value.customCss || {}
          }
        };
      }
      // Handle other object cases
      else {
        normalized[key] = {
          type: 'object',
          value: {
            ...value,
            tailwindCss: value.tailwindCss || '',
            customCss: value.customCss || {}
          }
        };
      }
    }
    // Handle simple strings/primitives
    else {
      normalized[key] = {
        type: 'text',
        value: value,
        tailwindCss: '',
        customCss: {}
      };
    }
  });

  return normalized;
};

export const EditableComponentRenderer: React.FC<EditableComponentRendererProps> = ({
  component,
  isSelected
}) => {
  const { selectComponent, updateComponent, state } = useEditor();
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contentType, setContentType] = useState<'text' | 'url' | 'image' | 'video' | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [currentStyles, setCurrentStyles] = useState<Record<string, string>>({});
  const [elementSelector, setElementSelector] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [dynamicFieldEditor, setDynamicFieldEditor] = useState<{ key: string, data: any } | null>(null);
  const [arrayEditor, setArrayEditor] = useState<{ key: string, data: any[] } | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const DynamicComponent = useMemo(() => {
    if (!component?.react_code) {
      console.error('No react_code found in component:', component);
      return null;
    }

    try {
      console.log('Starting component compilation for:', component.id);

      // Apply theme to code
      let themedCode = applyThemeToCode(component.react_code, state.theme);

      // Apply customizations if they exist
      if (component.customizableProps) {
        Object.entries(component.customizableProps).forEach(([key, value]) => {
          if (key.endsWith('_content')) {
            // Handle nested prop paths (e.g., "logo.value")
            const propPath = key.replace('_content', '');
            const propParts = propPath.split('.');

            if (propParts.length === 1) {
              // Simple prop replacement
              const elementType = propParts[0];
              if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].includes(elementType)) {
                themedCode = themedCode.replace(
                  new RegExp(`<${elementType}[^>]*>([^<]*)</${elementType}>`, 'g'),
                  (match, originalContent) => match.replace(originalContent, typeof value === 'string' ? value : JSON.stringify(value))
                );
              } else if (elementType === 'img') {
                themedCode = themedCode.replace(/src="[^"]*"/g, `src="${typeof value === 'string' ? value : (value as any).src || ''}"`);
              } else if (elementType === 'a') {
                themedCode = themedCode.replace(/href="[^"]*"/g, `href="${typeof value === 'string' ? value : (value as any).href || ''}"`);
              }
            } else {
              // Handle nested props like logo.value
              const regex = new RegExp(`{${propPath.replace('.', '\\?\\.')}}`, 'g');
              themedCode = themedCode.replace(regex, `"${typeof value === 'string' ? value : JSON.stringify(value)}"`);

              // Also handle optional chaining patterns
              const optionalRegex = new RegExp(`{${propPath.replace('.', '\\?\\.').replace('?', '\\?')}}`, 'g');
              themedCode = themedCode.replace(optionalRegex, `"${typeof value === 'string' ? value : JSON.stringify(value)}"`);
            }
          } else if (!key.endsWith('_styles')) {
            // Handle direct prop replacement for arrays and objects
            const regex = new RegExp(`{${key}}`, 'g');
            if (Array.isArray(value)) {
              themedCode = themedCode.replace(regex, JSON.stringify(value));
            } else if (typeof value === 'object' && value !== null) {
              themedCode = themedCode.replace(regex, JSON.stringify(value));
            } else {
              themedCode = themedCode.replace(regex, `"${value}"`);
            }
          }
        });
      }

      // Clean the code
      let cleanCode = themedCode
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
        .replace(/export\s+default\s+/, '')
        .trim();

      console.log('Cleaned code:', cleanCode);

      // Transpile JSX to JS using Babel
      const transpiledCode = Babel.transform(cleanCode, {
        presets: ['react'],
      }).code;

      console.log('Transpiled code:', transpiledCode);

      // IMPROVED: Better function name detection
      // Look for all function declarations, not just the first one
      const functionMatches = transpiledCode.matchAll(/function\s+([A-Za-z0-9_]+)\s*\(/g);
      const functions = Array.from(functionMatches).map(match => match[1]);

      console.log('All found functions:', functions);

      // Filter out utility functions like _extends, _objectSpread, etc.
      const componentFunction = functions.find(name =>
        !name.startsWith('_') && // Exclude Babel helpers
        !['extends', 'objectSpread', 'defineProperty', 'slicedToArray'].includes(name) &&
        name.length > 2 // Component names are usually longer
      );

      if (!componentFunction) {
        console.error('No valid component function found. Available functions:', functions);
        throw new Error('Unable to find component function name');
      }

      console.log('Using component function:', componentFunction);

      // Create a React component that calls the function properly
      const componentRenderer = (props: any) => {
        try {
          // Execute the transpiled code in a function scope
          const execFunction = new Function('React', 'props', `
            const { useState, useEffect, useMemo, useCallback } = React;
            ${transpiledCode}
            return ${componentFunction}(props);
          `);

          return execFunction(React, props);
        } catch (error) {
          console.error('Error executing component function:', error);
          throw error;
        }
      };

      console.log('Component function created successfully');
      return componentRenderer;
    } catch (error) {
      console.error('Error compiling component:', error);
      console.error('Component data:', {
        id: component.id,
        react_code: component.react_code,
        default_props: component.default_props
      });
      return null;
    }
  }, [component.react_code, component.customizableProps, state.theme]);

  const detectContentType = (element: HTMLElement): 'text' | 'url' | 'image' | 'video' | null => {
    if (element.tagName === 'IMG') return 'image';
    if (element.tagName === 'VIDEO') return 'video';
    if (element.tagName === 'A') return 'url';
    if (element.textContent && element.textContent.trim()) return 'text';
    return null;
  };

  const getElementContent = (element: HTMLElement): string => {
    if (element.tagName === 'IMG') return element.getAttribute('src') || '';
    if (element.tagName === 'VIDEO') return element.getAttribute('src') || '';
    if (element.tagName === 'A') return element.getAttribute('href') || '';
    return element.textContent || '';
  };

  const getElementStyles = (element: HTMLElement): Record<string, string> => {
    const computedStyles = window.getComputedStyle(element);
    return {
      fontSize: computedStyles.fontSize,
      fontWeight: computedStyles.fontWeight,
      fontFamily: computedStyles.fontFamily,
      color: computedStyles.color,
      backgroundColor: computedStyles.backgroundColor,
      margin: computedStyles.margin,
      padding: computedStyles.padding,
    };
  };

  const getElementSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(cls => cls.trim());
      if (classes.length > 0) return `.${classes[0]}`;
    }
    return element.tagName.toLowerCase();
  };

  const handleElementClick = (event: React.MouseEvent) => {
    if (!isSelected) return;

    event.stopPropagation();
    const target = event.target as HTMLElement;

    if (target !== componentRef.current) {
      setSelectedElement(target);
      const selector = getElementSelector(target);
      setElementSelector(selector);
      const type = detectContentType(target);

      // Enhanced detection for new data structure
      const editableType = target.getAttribute('data-editable');
      const propPath = target.getAttribute('data-prop-path');

      if (editableType && propPath) {
        // Get the actual prop value using the path
        const propValue = getPropByPath(component.default_props, propPath);

        if (editableType === 'array') {
          // Handle array editing with SmartArrayCRUD
          const arrayData = propValue?.value || propValue || [];
          setArrayEditor({ key: propPath, data: arrayData });
          return;
        } else if (editableType === 'content' && propValue) {
          // Handle content editing
          if (propValue.type === 'object' && propValue.value) {
            setDynamicFieldEditor({ key: propPath, data: propValue.value });
            return;
          } else if (propValue.type === 'text' || typeof propValue.value === 'string') {
            setContentType('text');
            setCurrentContent(propValue.value || propValue);
            setCurrentStyles(getElementStyles(target));
            setActiveTab('content');
            setEditModalOpen(true);
            return;
          }
        }
      }

      // Fallback to old detection method
      const dataKey = target.getAttribute('data-prop-key');
      if (dataKey && component.default_props && component.default_props[dataKey]) {
        const propValue = component.default_props[dataKey];
        if (Array.isArray(propValue) || (typeof propValue === 'object' && propValue !== null)) {
          setDynamicFieldEditor({ key: dataKey, data: propValue });
          return;
        }
      }

      if (type) {
        setContentType(type);
        setCurrentContent(getElementContent(target));
        setCurrentStyles(getElementStyles(target));
        setActiveTab('content');
        setEditModalOpen(true);
      } else {
        setCurrentStyles(getElementStyles(target));
        setActiveTab('style');
        setEditModalOpen(true);
      }
    }
  };

  // Helper function to get nested prop by path
  const getPropByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  // Helper function to set nested prop by path
  const setPropByPath = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      } else {
        current[key] = { ...current[key] };
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;

    return result;
  };

  const handleContentSave = (newContent: string) => {
    if (!selectedElement || !elementSelector) return;

    let contentKey = '';
    const tagName = selectedElement.tagName.toLowerCase();
    const propPath = selectedElement.getAttribute('data-prop-path');

    if (propPath) {
      // New structure - update using prop path
      const updatedProps = setPropByPath(component.default_props, propPath, {
        ...getPropByPath(component.default_props, propPath),
        value: newContent
      });

      updateComponent(state.currentPage, component.id, {
        default_props: updatedProps
      });
    } else {
      // Old structure fallback
      if (tagName === 'img') {
        contentKey = 'img_content';
      } else if (tagName === 'a') {
        contentKey = 'a_content';
      } else if (selectedElement.textContent) {
        const textContent = selectedElement.textContent.trim();

        if (component.default_props) {
          const findNestedProp = (obj: any, path: string[] = []): string | null => {
            for (const [key, value] of Object.entries(obj)) {
              const currentPath = [...path, key];
              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const result = findNestedProp(value, currentPath);
                if (result) return result;
              } else if (typeof value === 'string' && value === textContent) {
                return currentPath.join('.');
              }
            }
            return null;
          };

          const nestedProp = findNestedProp(component.default_props);
          if (nestedProp) {
            contentKey = `${nestedProp}_content`;
          } else {
            contentKey = `${tagName}_content`;
          }
        } else {
          contentKey = `${tagName}_content`;
        }
      }

      const updatedProps = {
        ...component.customizableProps,
        [contentKey]: newContent
      };

      updateComponent(state.currentPage, component.id, {
        customizableProps: updatedProps
      });
    }

    setEditModalOpen(false);
  };

  const handleStyleSave = (newStyles: Record<string, string>) => {
    if (!selectedElement || !elementSelector) return;

    const styleKey = `${selectedElement.tagName.toLowerCase()}_styles`;
    const updatedProps = {
      ...component.customizableProps,
      [styleKey]: newStyles
    };

    updateComponent(state.currentPage, component.id, {
      customizableProps: updatedProps
    });

    setEditModalOpen(false);
  };

  const handleDynamicFieldSave = (key: string, value: any) => {
    const updatedProps = {
      ...component.customizableProps,
      [key]: value
    };

    updateComponent(state.currentPage, component.id, {
      customizableProps: updatedProps,
      default_props: {
        ...component.default_props,
        [key]: value
      }
    });

    setDynamicFieldEditor(null);
  };

  const handleArraySave = (key: string, newData: any[]) => {
    const updatedProps = setPropByPath(component.default_props, key, {
      type: 'array',
      value: newData,
      tailwindCss: getPropByPath(component.default_props, key)?.tailwindCss || '',
      customCss: getPropByPath(component.default_props, key)?.customCss || {}
    });

    updateComponent(state.currentPage, component.id, {
      default_props: updatedProps
    });

    setArrayEditor(null);
  };

  const generateCustomStyles = (): string => {
    if (!component.customizableProps) return '';

    let customCSS = '';
    Object.entries(component.customizableProps).forEach(([key, value]) => {
      if (key.endsWith('_styles') && typeof value === 'object') {
        const elementType = key.replace('_styles', '');
        const styles = value as Record<string, string>;

        let cssRules = '';
        Object.entries(styles).forEach(([property, val]) => {
          if (val && val !== 'undefined') {
            const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
            cssRules += `${cssProperty}: ${val}; `;
          }
        });

        if (cssRules) {
          customCSS += `.editor-canvas ${elementType} { ${cssRules} } `;
        }
      }
    });

    return customCSS;
  };

  const renderComponent = () => {
    if (DynamicComponent) {
      try {
        // Normalize props to ensure compatibility
        const normalizedProps = normalizeProps(component.default_props);
        console.log('Calling DynamicComponent with normalized props:', normalizedProps);

        const result = DynamicComponent(normalizedProps);
        console.log('Component execution result:', result);

        if (React.isValidElement(result)) {
          console.log('Valid React element returned');
          return result;
        } else {
          console.error('Invalid React element returned:', result);
        }
      } catch (error: any) {
        console.error('Error executing dynamic component:', error);
        return (
          <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
            <div className="font-semibold">Component Execution Error</div>
            <div className="text-sm mt-1">{error.message}</div>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs">Show error details</summary>
              <div className="mt-2 p-2 bg-gray-100 rounded text-black text-xs">
                <div><strong>Error:</strong> {error.message}</div>
                <div><strong>Stack:</strong> {error.stack}</div>
                <div className="mt-2"><strong>Component Props:</strong></div>
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(component.default_props, null, 2)}
                </pre>
                <div className="mt-2"><strong>Normalized Props:</strong></div>
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(normalizeProps(component.default_props), null, 2)}
                </pre>
                <div className="mt-2"><strong>React Code:</strong></div>
                <pre className="text-xs overflow-auto max-h-32">
                  {component.react_code}
                </pre>
              </div>
            </details>
          </div>
        );
      }
    }

    return (
      <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-lg">
        <div className="font-semibold">Component Compilation Error</div>
        <div className="text-sm mt-1">Unable to compile component: {component.id}</div>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs">Show component details</summary>
          <div className="mt-2 p-2 bg-gray-100 rounded text-black text-xs">
            <div><strong>Component ID:</strong> {component.id}</div>
            <div><strong>Has React Code:</strong> {component.react_code ? 'Yes' : 'No'}</div>
            <div className="mt-2"><strong>React Code:</strong></div>
            <pre className="text-xs overflow-auto max-h-32">
              {component.react_code || 'No react_code found'}
            </pre>
            <div className="mt-2"><strong>Default Props:</strong></div>
            <pre className="text-xs overflow-auto max-h-32">
              {JSON.stringify(component.default_props, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: generateThemeCSS(state.theme) + generateCustomStyles()
      }} />
      <div
        ref={componentRef}
        className={`relative ${isSelected ? 'ring-2 ring-black ring-inset' : ''
          } hover:ring-1 hover:ring-gray-300 hover:ring-inset transition-all cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
          handleElementClick(e);
        }}
        style={{
          position: 'relative'
        }}
      >
        {renderComponent()}

        {isSelected && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs z-30 pointer-events-none">
            Click elements to edit
          </div>
        )}
      </div>

      {/* Edit Modal with Tabs */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl bg-[#1c1c1c] border-none">
          <DialogHeader>
            <DialogTitle className='text-white'>
              Edit {selectedElement?.tagName.toLowerCase()} Element
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'content' | 'style')}>
            <TabsList className="grid w-full grid-cols-2 bg-[#272725] text-white">
              {contentType && (
                <TabsTrigger value="content">Content</TabsTrigger>
              )}
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>

            {contentType && (
              <TabsContent value="content" className="mt-4">
                <ContentEditor
                  onClose={() => setEditModalOpen(false)}
                  contentType={contentType}
                  currentValue={currentContent}
                  onSave={handleContentSave}
                />
              </TabsContent>
            )}

            <TabsContent value="style" className="mt-4">
              <StyleEditor
                onClose={() => setEditModalOpen(false)}
                currentStyles={currentStyles}
                onSave={handleStyleSave}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dynamic Field Editor */}
      {dynamicFieldEditor && (
        <DynamicFieldEditor
          data={dynamicFieldEditor.data}
          dataKey={dynamicFieldEditor.key}
          onSave={handleDynamicFieldSave}
          onClose={() => setDynamicFieldEditor(null)}
        />
      )}

      {/* Smart Array CRUD Editor */}
      {arrayEditor && (
        <SmartArrayCRUD
          title={arrayEditor.key}
          data={arrayEditor.data}
          onSave={(newData) => handleArraySave(arrayEditor.key, newData)}
          onClose={() => setArrayEditor(null)}
        />
      )}
    </>
  );
};