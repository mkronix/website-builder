
import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Component } from '@/contexts/EditorContext';
import { Navigation } from '@/components/website/Navigation';
import { HeroSection } from '@/components/website/HeroSection';
import { Footer } from '@/components/website/Footer';

interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  component, 
  isSelected 
}) => {
  const { selectComponent } = useEditor();

  const renderDynamicComponent = () => {
    if (component.reactCode) {
      try {
        // Create a function from the React code string
        const componentFunction = new Function('React', 'props', `
          const { useState, useEffect } = React;
          ${component.reactCode}
        `);
        
        // Execute the function with React and props
        const DynamicComponent = componentFunction(React, component.props);
        
        // If it's a functional component, render it
        if (typeof DynamicComponent === 'function') {
          return React.createElement(DynamicComponent, component.props);
        }
        
        // If it returns JSX directly, return it
        return DynamicComponent;
      } catch (error) {
        console.error('Error rendering dynamic component:', error);
        return (
          <div className="p-8 text-center text-red-500 bg-red-50 border border-red-200 rounded">
            <p>Error rendering component: {component.type}</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        );
      }
    }

    // Fallback to static components for backwards compatibility
    return renderStaticComponent();
  };

  const renderStaticComponent = () => {
    switch (component.type) {
      case 'nav-simple':
        return <Navigation 
          logo={component.props.logo || 'Your Logo'} 
          links={component.props.links || [{ text: 'Home', href: '/' }]} 
        />;
      case 'hero-simple':
        return <HeroSection 
          title={component.props.title || 'Welcome'} 
          subtitle={component.props.subtitle || 'Build something amazing'} 
          buttonText={component.props.buttonText || 'Get Started'} 
        />;
      case 'footer':
        return <Footer 
          companyName={component.props.companyName || 'Your Company'} 
          links={component.props.links || [{ text: 'Privacy', href: '/privacy' }]} 
        />;
      case 'text-block':
        return (
          <div className="p-8">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: component.props.content || 'Your content goes here...' }}
            />
          </div>
        );
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <p>Component type "{component.type}" not implemented yet</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative ${
        isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
      } hover:ring-1 hover:ring-gray-300 hover:ring-inset transition-all cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
    >
      {renderDynamicComponent()}
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Selected
        </div>
      )}
    </div>
  );
};
