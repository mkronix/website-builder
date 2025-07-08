
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditor } from '@/contexts/EditorContext';
import { Component } from '@/contexts/editorTypes';
import { applyThemeToCode, generateElementSpecificCSS, generateThemeCSS } from '@/utils/themeUtils';
import * as Babel from '@babel/standalone';
import React, { useMemo, useRef, useState, useCallback } from 'react';
import ContentEditor from './ContentEditor';
import { DynamicFieldEditor } from './DynamicFieldEditor';
import { SmartArrayCRUD } from './SmartArrayCRUD';
import StyleEditor from './StyleEditor';

interface EditableComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

// Enhanced prop normalization with better type handling
const normalizeProps = (props: any): any => {
  if (!props) return {};

  const normalized: any = {};

  Object.entries(props).forEach(([key, value]: [string, any]) => {
    if (value && typeof value === 'object') {
      if (value.type && (value.value !== undefined || value.tailwindCss)) {
        normalized[key] = value;
      } else if (Array.isArray(value)) {
        if (value.length > 0 && value[0]?.tailwindCss !== undefined) {
          normalized[key] = {
            type: 'array',
            value: value,
            tailwindCss: '',
            customCss: {}
          };
        } else {
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
      } else if (value.text || value.src || value.href || value.email || Object.keys(value).length > 0) {
        normalized[key] = {
          type: 'object',
          value: {
            ...value,
            tailwindCss: value.tailwindCss || '',
            customCss: value.customCss || {}
          },
          tailwindCss: '',
          customCss: {}
        };
      } else {
        normalized[key] = {
          type: 'object',
          value: {
            ...value,
            tailwindCss: value.tailwindCss || '',
            customCss: value.customCss || {}
          },
          tailwindCss: '',
          customCss: {}
        };
      }
    } else {
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
  const [currentElementId, setCurrentElementId] = useState<string>('');
  const componentRef = useRef<HTMLDivElement>(null);

  // Enhanced dynamic component with better theme integration
  const DynamicComponent = useMemo(() => {
    console.log("Rendering component with theme:", state.theme);
    if (!component?.react_code) {
      console.error('No react_code found in component:', component);
      return null;
    }

    try {
      // Apply global theme to code with enhanced theme integration
      let themedCode = applyThemeToCode(component.react_code, state.theme);

      // Add unique identifiers with component-specific prefixing
      let elementCounter = 0;
      themedCode = themedCode.replace(
        /(<[^>]+)(className="[^"]*")([^>]*>)/g,
        (match, start, classNamePart, end) => {
          elementCounter++;
          const elementId = `${component.id}-element-${elementCounter}`;
          return `${start}${classNamePart} data-element-id="${elementId}" data-component-id="${component.id}"${end}`;
        }
      );

      // Enhanced content customization with proper prop handling
      if (component.customizableProps) {
        Object.entries(component.customizableProps).forEach(([key, value]) => {
          if (key.endsWith('_content') && !key.endsWith('_styles')) {
            const regex = new RegExp(`{${key.replace('_content', '')}}`, 'g');
            if (typeof value === 'string') {
              themedCode = themedCode.replace(regex, value);
            }
          } else if (!key.endsWith('_styles') && !key.endsWith('_content')) {
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

      // Enhanced default props handling
      if (component.default_props) {
        Object.entries(component.default_props).forEach(([key, propValue]) => {
          const regex = new RegExp(`{${key}}`, 'g');
          
          if (propValue && typeof propValue === 'object' && propValue.value !== undefined) {
            // New format with value property
            if (Array.isArray(propValue.value)) {
              themedCode = themedCode.replace(regex, JSON.stringify(propValue.value));
            } else if (typeof propValue.value === 'object') {
              themedCode = themedCode.replace(regex, JSON.stringify(propValue.value));
            } else {
              themedCode = themedCode.replace(regex, `"${propValue.value}"`);
            }
          } else if (Array.isArray(propValue)) {
            themedCode = themedCode.replace(regex, JSON.stringify(propValue));
          } else if (typeof propValue === 'object' && propValue !== null) {
            themedCode = themedCode.replace(regex, JSON.stringify(propValue));
          } else {
            themedCode = themedCode.replace(regex, `"${propValue}"`);
          }
        });
      }

      let cleanCode = themedCode
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
        .replace(/export\s+default\s+/, '')
        .trim();

      const transpiledCode = Babel.transform(cleanCode, {
        presets: ['react'],
      }).code;

      const functionMatches = transpiledCode.matchAll(/function\s+([A-Za-z0-9_]+)\s*\(/g);
      const functions = Array.from(functionMatches).map(match => match[1]);

      const componentFunction = functions.find(name =>
        !name.startsWith('_') &&
        !['extends', 'objectSpread', 'defineProperty', 'slicedToArray'].includes(name) &&
        name.length > 2
      );

      if (!componentFunction) {
        console.error('No valid component function found. Available functions:', functions);
        throw new Error('Unable to find component function name');
      }

      const componentRenderer = (props: any) => {
        try {
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

      return componentRenderer;
    } catch (error) {
      console.error('Error compiling component:', error);
      return null;
    }
  }, [component.react_code, component.customizableProps, component.default_props, state.theme]);

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
    const elementId = element.getAttribute('data-element-id');
    const componentId = element.getAttribute('data-component-id');

    // Enhanced element-specific style retrieval
    if (elementId && component.customizableProps) {
      const styleKey = `${elementId}_styles`;
      const existingStyles = component.customizableProps[styleKey];

      if (existingStyles && typeof existingStyles === 'object') {
        return {
          className: existingStyles.tailwindCss || '',
          ...existingStyles.customCss || {},
          ...existingStyles
        };
      }
    }

    // Fallback to computed styles
    const computedStyles = window.getComputedStyle(element);
    return {
      fontSize: computedStyles.fontSize,
      fontWeight: computedStyles.fontWeight,
      fontFamily: computedStyles.fontFamily,
      color: computedStyles.color,
      backgroundColor: computedStyles.backgroundColor,
      margin: computedStyles.margin,
      padding: computedStyles.padding,
      className: element.className || ''
    };
  };

  const getElementSelector = (element: HTMLElement): string => {
    const elementId = element.getAttribute('data-element-id');
    if (elementId) return `[data-element-id="${elementId}"]`;
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(cls => cls.trim());
      if (classes.length > 0) return `.${classes[0]}`;
    }
    return element.tagName.toLowerCase();
  };

  const hasComplexChildren = (element: HTMLElement): boolean => {
    const children = Array.from(element.children);
    return children.length > 0 || element.querySelector('button, a, img, video, input, select, textarea') !== null;
  };

  const handleElementClick = useCallback((event: React.MouseEvent) => {
    if (!isSelected) return;

    event.stopPropagation();
    const target = event.target as HTMLElement;

    if (target !== componentRef.current) {
      setSelectedElement(target);
      const selector = getElementSelector(target);
      setElementSelector(selector);

      let elementId = target.getAttribute('data-element-id');
      if (!elementId) {
        elementId = `${component.id}-element-${Date.now()}`;
        target.setAttribute('data-element-id', elementId);
        target.setAttribute('data-component-id', component.id);
      }
      setCurrentElementId(elementId);

      const type = detectContentType(target);
      const editableType = target.getAttribute('data-editable');
      const propPath = target.getAttribute('data-prop-path');
      const isComplexElement = hasComplexChildren(target);

      console.log('Element clicked:', { editableType, propPath, target, elementId, isComplexElement });

      if (editableType && propPath) {
        const propValue = getPropByPath(component.default_props, propPath);
        console.log('Prop value found:', propValue);

        if (editableType === 'array') {
          let arrayData = [];

          if (propValue?.value && Array.isArray(propValue.value)) {
            arrayData = propValue.value;
          } else if (Array.isArray(propValue)) {
            arrayData = propValue;
          } else if (propValue?.type === 'array' && propValue?.value) {
            arrayData = propValue.value;
          }

          console.log('Opening array editor with data:', arrayData);
          setArrayEditor({ key: propPath, data: arrayData });
          return;
        } else if (editableType === 'object') {
          let objectData = {};

          if (propValue?.value && typeof propValue.value === 'object') {
            objectData = propValue.value;
          } else if (typeof propValue === 'object' && !Array.isArray(propValue)) {
            objectData = propValue;
          }

          console.log('Opening object editor with data:', objectData);
          setDynamicFieldEditor({ key: propPath, data: objectData });
          return;
        } else if (editableType === 'content' && propValue && !isComplexElement) {
          let contentValue = '';

          if (propValue.value !== undefined) {
            contentValue = propValue.value;
          } else if (typeof propValue === 'string') {
            contentValue = propValue;
          }

          setContentType('text');
          setCurrentContent(contentValue);
          setCurrentStyles(getElementStyles(target));
          setActiveTab('content');
          setEditModalOpen(true);
          return;
        }
      }

      const dataKey = target.getAttribute('data-prop-key');
      if (dataKey && component.default_props && component.default_props[dataKey]) {
        const propValue = component.default_props[dataKey];

        if (Array.isArray(propValue)) {
          console.log('Opening array editor (fallback) with data:', propValue);
          setArrayEditor({ key: dataKey, data: propValue });
          return;
        } else if (typeof propValue === 'object' && propValue !== null) {
          console.log('Opening object editor (fallback) with data:', propValue);
          setDynamicFieldEditor({ key: dataKey, data: propValue });
          return;
        }
      }

      if (isComplexElement) {
        setContentType(null);
        setCurrentStyles(getElementStyles(target));
        setActiveTab('style');
        setEditModalOpen(true);
        return;
      }

      if (type && !isComplexElement) {
        setContentType(type);
        setCurrentContent(getElementContent(target));
        setCurrentStyles(getElementStyles(target));
        setActiveTab('content');
        setEditModalOpen(true);
      } else {
        setContentType(null);
        setCurrentStyles(getElementStyles(target));
        setActiveTab('style');
        setEditModalOpen(true);
      }
    }
  }, [isSelected, component.default_props, component.id]);

  const getPropByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

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

  const handleContentSave = useCallback((newContent: string) => {
    if (!selectedElement || !elementSelector) return;

    const propPath = selectedElement.getAttribute('data-prop-path');
    const elementId = selectedElement.getAttribute('data-element-id');

    if (propPath) {
      const existingProp = getPropByPath(component.default_props, propPath);
      const updatedProp = {
        ...existingProp,
        value: newContent
      };

      const updatedProps = setPropByPath(component.default_props, propPath, updatedProp);

      updateComponent(state.currentPage, component.id, {
        default_props: updatedProps
      });
    } else {
      const contentKey = elementId ? `${elementId}_content` : `content_${Date.now()}`;

      const updatedProps = {
        ...component.customizableProps,
        [contentKey]: newContent
      };

      updateComponent(state.currentPage, component.id, {
        customizableProps: updatedProps
      });
    }

    setEditModalOpen(false);
  }, [selectedElement, elementSelector, component, updateComponent, state.currentPage]);

  const handleStyleSave = useCallback((newStyles: Record<string, string>) => {
    if (!selectedElement || !elementSelector) return;

    const elementId = selectedElement.getAttribute('data-element-id') || currentElementId;

    if (!elementId) {
      console.error('No element ID found for styling');
      return;
    }

    const styleKey = `${elementId}_styles`;
    const tailwindCss = newStyles.className || '';
    const customCss = { ...newStyles };
    delete customCss.className;

    const elementStyles = {
      tailwindCss,
      customCss,
      ...customCss
    };

    const updatedProps = {
      ...component.customizableProps,
      [styleKey]: elementStyles
    };

    updateComponent(state.currentPage, component.id, {
      customizableProps: updatedProps
    });

    setEditModalOpen(false);
  }, [selectedElement, elementSelector, currentElementId, component, updateComponent, state.currentPage]);

  const handleDynamicFieldSave = useCallback((key: string, value: any) => {
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
  }, [component, updateComponent, state.currentPage]);

  const handleArraySave = useCallback((key: string, newData: any[]) => {
    console.log('Saving array data:', { key, newData });

    const existingProp = getPropByPath(component.default_props, key);

    let updatedPropValue;
    if (existingProp && typeof existingProp === 'object' && existingProp.type) {
      updatedPropValue = {
        ...existingProp,
        value: newData
      };
    } else {
      updatedPropValue = {
        type: 'array',
        value: newData,
        tailwindCss: existingProp?.tailwindCss || '',
        customCss: existingProp?.customCss || {}
      };
    }

    const updatedProps = setPropByPath(component.default_props, key, updatedPropValue);

    updateComponent(state.currentPage, component.id, {
      default_props: updatedProps
    });

    setArrayEditor(null);
  }, [component, updateComponent, state.currentPage]);

  const generateCustomStyles = useCallback((): string => {
    return generateElementSpecificCSS(component.id, component.customizableProps);
  }, [component.id, component.customizableProps]);

  const generateGlobalThemeStyles = useCallback((): string => {
    return generateThemeCSS(state.theme);
  }, [state.theme]);

  const renderComponent = () => {
    if (DynamicComponent) {
      try {
        const normalizedProps = normalizeProps(component.default_props);
        const result = DynamicComponent(normalizedProps);
        if (React.isValidElement(result)) {
          return result;
        } else {
          console.error('Invalid React element returned:', result);
        }
      } catch (error: any) {
        console.error('Error executing dynamic component:', error);
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
      {/* Enhanced styling with both global theme and element-specific styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          ${generateGlobalThemeStyles()}
          ${generateCustomStyles()}
        `
      }} />
      
      <div
        ref={componentRef}
        className="relative cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
          handleElementClick(e);
        }}
        style={{ position: 'relative' }}
      >
        {renderComponent()}
      </div>

      {/* Enhanced Edit Modal with better tab handling */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl bg-[#1c1c1c] border-none">
          <DialogHeader>
            <DialogTitle className='text-white'>
              Edit {selectedElement?.tagName.toLowerCase()} Element
              {currentElementId && (
                <span className="text-sm text-gray-400 ml-2">({currentElementId})</span>
              )}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'content' | 'style')}>
            <TabsList className={`grid w-full ${contentType ? 'grid-cols-2' : 'grid-cols-1'} bg-[#272725] text-white`}>
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

      {/* Enhanced Dynamic Field Editor */}
      {dynamicFieldEditor && (
        <DynamicFieldEditor
          data={dynamicFieldEditor.data}
          dataKey={dynamicFieldEditor.key}
          onSave={handleDynamicFieldSave}
          onClose={() => setDynamicFieldEditor(null)}
        />
      )}

      {/* Enhanced Smart Array CRUD Editor */}
      {arrayEditor && (
        <SmartArrayCRUD
          title={`Edit ${arrayEditor.key}`}
          data={arrayEditor.data}
          onSave={(newData) => handleArraySave(arrayEditor.key, newData)}
          onClose={() => setArrayEditor(null)}
        />
      )}
    </>
  );
};
