
import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Navigation, HeroBanner, Layout, FileText, Mail, Image, Type } from 'lucide-react';

export const ComponentLibrary = () => {
  const { addComponent, state } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const componentCategories = [
    {
      id: 'navigation',
      name: 'Navigation',
      icon: Navigation,
      components: [
        { id: 'nav-simple', name: 'Simple Navigation', preview: 'Simple header with logo and links' },
        { id: 'nav-dropdown', name: 'Dropdown Navigation', preview: 'Navigation with dropdown menus' },
        { id: 'nav-sidebar', name: 'Sidebar Navigation', preview: 'Mobile-friendly sidebar nav' },
      ]
    },
    {
      id: 'hero',
      name: 'Hero Sections',
      icon: HeroBanner,
      components: [
        { id: 'hero-simple', name: 'Simple Hero', preview: 'Clean hero with text and CTA' },
        { id: 'hero-image', name: 'Hero with Image', preview: 'Hero section with background image' },
        { id: 'hero-video', name: 'Video Hero', preview: 'Hero with video background' },
      ]
    },
    {
      id: 'layout',
      name: 'Layout',
      icon: Layout,
      components: [
        { id: 'section-2col', name: '2 Column Section', preview: 'Two column layout' },
        { id: 'section-3col', name: '3 Column Section', preview: 'Three column layout' },
        { id: 'section-grid', name: 'Grid Section', preview: 'Flexible grid layout' },
      ]
    },
    {
      id: 'content',
      name: 'Content',
      icon: FileText,
      components: [
        { id: 'text-block', name: 'Text Block', preview: 'Rich text content block' },
        { id: 'feature-list', name: 'Feature List', preview: 'List of features with icons' },
        { id: 'testimonial', name: 'Testimonial', preview: 'Customer testimonial card' },
      ]
    }
  ];

  const addComponentToPage = (componentType: string) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      type: componentType,
      props: getDefaultProps(componentType),
    };

    addComponent(state.currentPage, newComponent);
    setSelectedCategory(null);
  };

  const getDefaultProps = (type: string) => {
    const defaults: Record<string, any> = {
      'nav-simple': { logo: 'Your Logo', links: [{ text: 'Home', href: '/' }, { text: 'About', href: '/about' }] },
      'hero-simple': { title: 'Welcome to Your Website', subtitle: 'Build something amazing', buttonText: 'Get Started' },
      'text-block': { content: 'Your content goes here...' },
    };
    return defaults[type] || {};
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-white font-semibold mb-4">Add Components</h3>
      
      <div className="space-y-2">
        {componentCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#272725]"
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {category.name}
            </Button>
          );
        })}
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {componentCategories.find(c => c.id === selectedCategory)?.name} Components
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {componentCategories
              .find(c => c.id === selectedCategory)
              ?.components.map((component) => (
                <div
                  key={component.id}
                  className="p-4 bg-[#272725] rounded-lg border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => addComponentToPage(component.id)}
                >
                  <h4 className="text-white font-medium mb-2">{component.name}</h4>
                  <p className="text-gray-400 text-sm">{component.preview}</p>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
