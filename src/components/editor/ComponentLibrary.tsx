
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';
import { Plus } from 'lucide-react';

interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  defaultProps: Record<string, any>;
}

const componentTemplates: ComponentTemplate[] = [
  {
    id: 'hero-1',
    name: 'Hero Section - Centered',
    category: 'Hero',
    description: 'Clean centered hero with title, subtitle, and CTA',
    preview: '/placeholder.svg',
    defaultProps: {
      title: 'Welcome to Our Website',
      subtitle: 'Build amazing experiences with our tools',
      buttonText: 'Get Started',
      backgroundColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    },
  },
  {
    id: 'hero-2',
    name: 'Hero Section - Split',
    category: 'Hero',
    description: 'Split layout hero with image and content',
    preview: '/placeholder.svg',
    defaultProps: {
      title: 'Transform Your Business',
      subtitle: 'Professional solutions for modern companies',
      buttonText: 'Learn More',
      image: '/placeholder.svg',
      imageAlt: 'Hero image',
    },
  },
  {
    id: 'navbar-1',
    name: 'Navigation - Modern',
    category: 'Navigation',
    description: 'Clean modern navigation bar',
    preview: '/placeholder.svg',
    defaultProps: {
      logo: 'Brand',
      links: [
        { text: 'Home', href: '/' },
        { text: 'About', href: '/about' },
        { text: 'Services', href: '/services' },
        { text: 'Contact', href: '/contact' },
      ],
    },
  },
  {
    id: 'footer-1',
    name: 'Footer - Simple',
    category: 'Footer',
    description: 'Simple footer with links and copyright',
    preview: '/placeholder.svg',
    defaultProps: {
      companyName: 'Your Company',
      links: [
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Contact', href: '/contact' },
      ],
    },
  },
];

interface ComponentLibraryProps {
  searchTerm: string;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ searchTerm }) => {
  const { addComponent, state } = useEditor();

  const filteredComponents = componentTemplates.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(filteredComponents.map((c) => c.category))];

  const handleAddComponent = (template: ComponentTemplate) => {
    const newComponent = {
      id: `${template.id}-${Date.now()}`,
      type: template.id,
      props: template.defaultProps,
    };

    addComponent(state.currentPage, newComponent);
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
          <div className="space-y-3">
            {filteredComponents
              .filter((component) => component.category === category)
              .map((component) => (
                <div
                  key={component.id}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900 mb-1">
                        {component.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">
                        {component.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded h-20 mb-3 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleAddComponent(component)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Component
                  </Button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
