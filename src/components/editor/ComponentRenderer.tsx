import React, { useMemo } from 'react';
import { Component, useEditor } from '@/contexts/EditorContext';

interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected
}) => {
  const { selectComponent } = useEditor();

  // Memoize the dynamic component to avoid re-compilation on every render
  const DynamicComponent = useMemo(() => {
    if (!component.reactCode) return null;

    try {
      // Clean the React code
      let cleanCode = component.reactCode
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '') // Remove imports
        .replace(/export\s+default\s+/, '') // Remove export default
        .trim();

      // Handle function components (most common case)
      if (cleanCode.startsWith('function')) {
        return new Function(
          'React',
          'props',
          `
          const { useState, useEffect, useMemo, useCallback } = React;
          
          ${cleanCode}
          
          // Get the function name from the code
          const funcName = "${cleanCode.match(/function\s+(\w+)/)?.[1] || 'Component'}";
          const ComponentFunc = eval(funcName);
          
          return React.createElement(ComponentFunc, props);
          `
        );
      } else if (cleanCode.includes('=>')) {
        // Arrow function component
        return new Function(
          'React',
          'props',
          `
          const { useState, useEffect, useMemo, useCallback } = React;
          
          const Component = ${cleanCode.startsWith('(') ? cleanCode : `(${cleanCode})`};
          
          return React.createElement(Component, props);
          `
        );
      } else {
        // JSX return statement
        return new Function(
          'React',
          'props',
          `
          const { useState, useEffect, useMemo, useCallback } = React;
          
          const Component = (props) => {
            ${cleanCode.startsWith('return') ? cleanCode : `return ${cleanCode}`}
          };
          
          return React.createElement(Component, props);
          `
        );
      }
    } catch (error) {
      console.error('Error compiling component:', error);
      return null;
    }
  }, [component.reactCode]);

  const renderComponent = () => {
    // Try dynamic component first
    if (DynamicComponent) {
      try {
        const result = DynamicComponent(React, component.props || {});

        // Validate the result is a valid React element
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
                {component.reactCode}
              </pre>
            </details>
          </div>
        );
      }
    }

    // Fallback to static components based on category
    return renderStaticComponent();
  };

  const getComponentCategory = (type: string) => {
    // Extract category from component ID (e.g., "navbar_001" -> "navbar")
    if (type.startsWith('navbar_')) return 'navbar';
    if (type.startsWith('hero_')) return 'hero';
    if (type.startsWith('features_')) return 'features';
    if (type.startsWith('services_')) return 'services';
    if (type.startsWith('about_')) return 'about';
    if (type.startsWith('contact_')) return 'contact';
    if (type.startsWith('footer_')) return 'footer';

    // Fallback to the original type
    return type;
  };

  const renderStaticComponent = () => {
    const props = component.props || {};
    const category = getComponentCategory(component.type);

    switch (category) {
      case 'navbar':
        return (
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="text-xl font-bold text-gray-800">
                  {props.logo?.value || props.logo || 'Brand'}
                </div>
                <div className="hidden md:flex space-x-8">
                  {(props.navigation_items || props.links || []).map((item: any, index: number) => (
                    <a
                      key={index}
                      href={item.href || item.url || '#'}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {item.label || item.text || `Link ${index + 1}`}
                    </a>
                  ))}
                </div>
                {props.cta_button && (
                  <a
                    href={props.cta_button.href || '#'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {props.cta_button.text || 'CTA'}
                  </a>
                )}
              </div>
            </div>
          </nav>
        );

      case 'hero':
        return (
          <section className="min-h-screen flex items-center bg-gradient-to-r from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                    {props.headline || props.title || 'Welcome to Our Platform'}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {props.subheadline || props.subtitle || 'Build something amazing with our tools and services.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {props.primary_cta && (
                      <a
                        href={props.primary_cta.href || '#'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
                      >
                        {props.primary_cta.text || 'Get Started'}
                      </a>
                    )}
                    {props.secondary_cta && (
                      <a
                        href={props.secondary_cta.href || '#'}
                        className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
                      >
                        {props.secondary_cta.text || 'Learn More'}
                      </a>
                    )}
                  </div>
                </div>
                {props.hero_image && (
                  <div className="relative">
                    <img
                      src={props.hero_image.src || '/placeholder-image.jpg'}
                      alt={props.hero_image.alt || 'Hero image'}
                      className="rounded-lg shadow-2xl w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'features':
        return (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {props.section_title || 'Our Features'}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {props.section_subtitle || 'Discover what makes us different'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {(props.features || []).map((feature: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title || `Feature ${index + 1}`}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description || 'Feature description goes here.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {props.section_title || 'Our Services'}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {props.section_subtitle || 'Comprehensive solutions for your needs'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(props.services || []).map((service: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 border">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    {service.features && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-center text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    {service.pricing && (
                      <div className="text-2xl font-bold text-blue-600">{service.pricing}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  {props.headline || 'About Us'}
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {props.story_content || 'Our story and mission'}
                </p>
              </div>

              {props.values && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {props.values.map((value: any, index: number) => (
                    <div key={index} className="p-6">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h4>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {props.stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {props.stats.map((stat: any, index: number) => (
                    <div key={index} className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'contact':
        return (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {props.headline || 'Contact Us'}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {props.subheadline || 'Get in touch with us'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
                  <form className="space-y-6">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      rows={4}
                      placeholder="Your Message"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>

                <div className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    {props.contact_info?.address && (
                      <p className="text-gray-600">{props.contact_info.address}</p>
                    )}
                    {props.contact_info?.phone && (
                      <p className="text-gray-600">{props.contact_info.phone}</p>
                    )}
                    {props.contact_info?.email && (
                      <p className="text-gray-600">{props.contact_info.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-4">
                    {props.company_info?.logo || props.companyName || 'Company'}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {props.company_info?.description || 'Company description goes here.'}
                  </p>
                </div>

                {props.navigation_columns?.map((column: any, index: number) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold mb-4">{column.title}</h4>
                    <ul className="space-y-2">
                      {column.links.map((link: any, linkIndex: number) => (
                        <li key={linkIndex}>
                          <a href={link.href || '#'} className="text-gray-300 hover:text-white transition-colors">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-300">
                  {props.copyright || '© 2025 Company Name. All rights reserved.'}
                </p>
              </div>
            </div>
          </footer>
        );

      default:
        return (
          <div className="p-8 text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="font-medium">Unknown component type: "{component.type}"</p>
            <p className="text-sm mt-2">Category: "{category}"</p>
            {component.reactCode && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer">Show raw code</summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-32 text-black">
                  {component.reactCode}
                </pre>
              </details>
            )}
          </div>
        );
    }
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

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs z-10">
          Selected: {component.type}
        </div>
      )}
    </div>
  );
};