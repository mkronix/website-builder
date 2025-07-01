import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as Babel from '@babel/standalone';
import { Component, useEditor } from '@/contexts/EditorContext';
import { applyThemeToCode, generateThemeCSS } from '@/utils/themeUtils';
import { ContentEditModal } from './ContentEditModal';
import { StyleEditModal } from './StyleEditModal';

interface EditableComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

export const EditableComponentRenderer: React.FC<EditableComponentRendererProps> = ({
  component,
  isSelected
}) => {
  const { selectComponent, updateComponent, state } = useEditor();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [styleModalOpen, setStyleModalOpen] = useState(false);
  const [contentType, setContentType] = useState<'text' | 'url' | 'image' | 'video' | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [currentStyles, setCurrentStyles] = useState<Record<string, string>>({});
  const [elementSelector, setElementSelector] = useState<string>('');
  const componentRef = useRef<HTMLDivElement>(null);

  const DynamicComponent = useMemo(() => {
    if (!component?.react_code) return null;

    try {
      let themedCode = applyThemeToCode(component.react_code, state.theme);

      // Apply content customizations with support for nested props
      if (component.customizableProps) {
        Object.entries(component.customizableProps).forEach(([key, value]) => {
          if (key.endsWith('_content') && typeof value === 'string') {
            // Handle nested prop paths (e.g., "logo.value")
            const propPath = key.replace('_content', '');
            const propParts = propPath.split('.');

            if (propParts.length === 1) {
              // Simple prop replacement
              const elementType = propParts[0];
              if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].includes(elementType)) {
                themedCode = themedCode.replace(
                  new RegExp(`<${elementType}[^>]*>([^<]*)</${elementType}>`, 'g'),
                  (match, originalContent) => match.replace(originalContent, value)
                );
              } else if (elementType === 'img') {
                themedCode = themedCode.replace(/src="[^"]*"/g, `src="${value}"`);
              } else if (elementType === 'a') {
                themedCode = themedCode.replace(/href="[^"]*"/g, `href="${value}"`);
              }
            } else {
              // Handle nested props like logo.value
              const regex = new RegExp(`{${propPath.replace('.', '\\?\\.')}}`, 'g');
              themedCode = themedCode.replace(regex, `"${value}"`);

              // Also handle optional chaining patterns
              const optionalRegex = new RegExp(`{${propPath.replace('.', '\\?\\.').replace('?', '\\?')}}`, 'g');
              themedCode = themedCode.replace(optionalRegex, `"${value}"`);
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
      if (type) {
        setContentType(type);
        setCurrentContent(getElementContent(target));
        setCurrentStyles(getElementStyles(target));
      }
    }
  };

  const handleElementHover = (event: React.MouseEvent) => {
    if (!isSelected) return;

    const target = event.target as HTMLElement;
    if (target !== componentRef.current && target !== hoveredElement) {
      setHoveredElement(target);
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

    setContentModalOpen(false);
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

    setStyleModalOpen(false);
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

  useEffect(() => {
    if (!isSelected || !componentRef.current) return;

    const handleMouseLeave = () => {
      setHoveredElement(null);
    };

    const componentElement = componentRef.current;
    componentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      componentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isSelected]);

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
        onMouseOver={handleElementHover}
        style={{
          position: 'relative'
        }}
      >
        {renderComponent()}

        {/* Hover overlay */}
        {isSelected && hoveredElement && (
          <div
            className="absolute pointer-events-none border-2 border-dashed border-black bg-black/30 bg-opacity-10"
            style={{
              top: hoveredElement.offsetTop,
              left: hoveredElement.offsetLeft,
              width: hoveredElement.offsetWidth,
              height: hoveredElement.offsetHeight,
              zIndex: 10
            }}
          />
        )}

        {/* Selected element overlay with edit buttons */}
        {isSelected && selectedElement && (
          <div
            className="absolute flex gap-1 z-20"
            style={{
              top: selectedElement.offsetTop - 32,
              left: selectedElement.offsetLeft,
            }}
          >
            {contentType && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContentModalOpen(true);
                }}
                className="px-2 py-1 bg-black text-white text-xs rounded hover:bg-black/30"
              >
                Edit Content
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStyleModalOpen(true);
              }}
              className="px-2 py-1 bg-white text-black text-xs rounded hover:bg-white/30"
            >
              Edit Style
            </button>
          </div>
        )}
      </div>

      <ContentEditModal
        isOpen={contentModalOpen}
        onClose={() => setContentModalOpen(false)}
        contentType={contentType}
        currentValue={currentContent}
        onSave={handleContentSave}
      />

      <StyleEditModal
        isOpen={styleModalOpen}
        onClose={() => setStyleModalOpen(false)}
        currentStyles={currentStyles}
        onSave={handleStyleSave}
      />
    </>
  );
};
