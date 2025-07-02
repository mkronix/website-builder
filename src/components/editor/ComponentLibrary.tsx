
import { useState } from 'react';
import { Component, useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Navigation, Layout, FileText, Type, Info, Phone, Users, Briefcase, Star, MessageSquare } from 'lucide-react';
import componentsData from '@/data/components.json';

export const ComponentLibrary = () => {
  const { addComponent, state } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Transform the new data structure to match our needs
  const componentCategories = Object.entries(componentsData).map(([key, category]: [string, any]) => ({
    id: key,
    name: category.name,
    description: category.description,
    icon: getIconForCategory(key),
    components: category.components
  }));

  function getIconForCategory(categoryKey: string) {
    switch (categoryKey.toLowerCase()) {
      case 'navbar':
        return Navigation;
      case 'hero':
        return Type;
      case 'footer':
        return Layout;
      case 'about':
        return Info;
      case 'contact':
        return Phone;
      case 'team':
        return Users;
      case 'services':
        return Briefcase;
      case 'features':
        return Star;
      case 'testimonials':
        return MessageSquare;
      default:
        return FileText;
    }
  }

  const addComponentToPage = (component: any) => {
    const newComponent: Component = {
      id: `${component.id}-${Date.now()}`,
      category: component.category,
      default_props: { ...component.default_props },
      react_code: component.react_code,
      customizableProps: {},
      variant: component.variant || 'default'
    };

    addComponent(state.currentPage, newComponent);
    setSelectedCategory(null);
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
              className="w-full justify-start px-1 text-white hover:text-white hover:bg-[#272725]"
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div>{category.name}</div>
                <div className="text-xs text-white/70 truncate text-ellipsis">{category.description.length > 34 ? category.description.slice(0, 34) + '...' : category.description}</div>
              </div>
            </Button>
          );
        })}
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {componentCategories.find(c => c.id === selectedCategory)?.name} Components
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 mt-4">
            {componentCategories
              .find(c => c.id === selectedCategory)
              ?.components.map((component: any) => (
                <div
                  key={component.id}
                  className="p-4 bg-[#272725] rounded-lg border border-gray-600 cursor-pointer hover:border-black transition-colors"
                  onClick={() => addComponentToPage(component)}
                >
                  {/* Preview Image */}
                  <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden h-40 flex items-center justify-center">
                    {component.preview_image ? (
                      <img
                        src={component.preview_image}
                        alt={component.name}
                        className="w-full h-full object-fill"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className="text-gray-500 text-sm hidden">
                      Component Preview
                    </div>
                  </div>

                  {/* Component Info */}
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-lg">{component.name}</h4>
                    <p className="text-gray-400 text-sm">{component.description}</p>

                    {/* Tags */}
                    {component.tags && component.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {component.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-black text-white hover:bg-black/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {component.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-black text-gray-300">
                            +{component.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <p className="text-white text-sm font-medium">Click to add this component</p>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};