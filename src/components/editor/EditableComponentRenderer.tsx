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

interface EditableComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

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
  const [dynamicFieldEditor, setDynamicFieldEditor] = useState<{key: string, data: any} | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const DynamicComponent = useMemo(() => {
    if (!component?.react_code) return null;

    try {
      let themedCode = applyThemeToCode(component.react_code, state.theme);

      // Apply content customizations with support for nested props and arrays/objects
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

      let cleanCode = themedCode
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
        .replace(/export\s+default\s+/, '')
        .trim();

      const transpiledCode = Babel.transform(cleanCode, {
        presets: ['react'],
      }).code;

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

      // Check if this element has a data attribute that maps to a complex prop
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
        setActiveTab('content'); // Default to content tab
        setEditModalOpen(true);
      } else {
        // If no content type detected, default to style tab
        setCurrentStyles(getElementStyles(target));
        setActiveTab('style');
        setEditModalOpen(true);
      }
    }
  };

  const handleContentSave = (newContent: string) => {
    if (!selectedElement || !elementSelector) return;

    // Handle different content types and create appropriate keys
    let contentKey = '';
    const tagName = selectedElement.tagName.toLowerCase();

    if (tagName === 'img') {
      contentKey = 'img_content';
    } else if (tagName === 'a') {
      contentKey = 'a_content';
    } else if (selectedElement.textContent) {
      // For text elements, try to identify nested props
      const textContent = selectedElement.textContent.trim();

      // Check if this might be a nested prop like logo.value
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
      </div>

      {/* Edit Modal with Tabs */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}

      >
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
    </>
  );
};