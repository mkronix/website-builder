
import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Navigation, Layout, FileText, Type } from 'lucide-react';
import websiteData from '@/data/data.json';

export const ComponentLibrary = () => {
  const { addComponent, state } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const componentCategories = Object.entries(websiteData.component_library.categories).map(([key, category]) => ({
    id: key,
    name: category.name,
    icon: getIconForCategory(category.name),
    components: category.components
  }));

  function getIconForCategory(categoryName: string) {
    switch (categoryName.toLowerCase()) {
      case 'navigation': return Navigation;
      case 'hero sections': return Type;
      case 'layout': return Layout;
      default: return FileText;
    }
  }

  const addComponentToPage = (component: any) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      type: component.id,
      props: { ...component.default_props },
      reactCode: component.react_code,
      customizableProps: component.customizable_props
    };

    console.log('Adding component:', newComponent);
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
        <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {componentCategories.find(c => c.id === selectedCategory)?.name} Components
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {componentCategories
              .find(c => c.id === selectedCategory)
              ?.components.map((component: any) => (
                <div
                  key={component.id}
                  className="p-4 bg-[#272725] rounded-lg border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => addComponentToPage(component)}
                >
                  <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden h-48">
                    {component.preview_image ? (
                      <img
                        src={component.preview_image}
                        alt={component.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No preview available
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-medium mb-2">{component.name}</h4>
                  <p className="text-gray-400 text-sm mb-2">{component.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {component.tags?.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
