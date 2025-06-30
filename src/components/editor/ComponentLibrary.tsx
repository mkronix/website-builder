
import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import data from '@/data/data.json';

const CATEGORIES = [
  'All',
  'navbar',
  'hero',
  'features', 
  'services',
  'about',
  'contact',
  'footer'
];

export const ComponentLibrary: React.FC = () => {
  const { addComponent, state } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Type assertion to access ui_components safely
  const uiData = data as any;
  const components = (uiData.ui_components || []).filter((comp: any) => 
    (selectedCategory === 'All' || comp.category === selectedCategory) &&
    (searchQuery === '' || 
     comp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
     comp.variant.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddComponent = (component: any) => {
    const newComponent = {
      id: `${component.category}_${Date.now()}`,
      category: component.category,
      variant: component.variant,
      default_props: component.default_props || {},
      content: component.content || '',
      react_code: component.react_code || '',
      customizableProps: component.customizableProps || {},
      customTailwindClass: component.customTailwindClass || '',
      customStyleCss: component.customStyleCss || {}
    };

    addComponent(state.currentPage, newComponent);
  };

  return (
    <div className="w-80 bg-[#1c1c1c] border-r border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-white font-semibold text-lg mb-4">Components</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#272725] border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-1 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-blue-600 hover:bg-blue-700 text-white text-xs whitespace-nowrap"
                  : "border-gray-600 text-gray-300 hover:bg-[#272725] hover:text-white text-xs whitespace-nowrap"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {components.length > 0 ? (
            components.map((component: any, index: number) => (
              <Card key={index} className="bg-[#272725] border-gray-600 hover:bg-[#2a2a28] transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm capitalize">
                      {component.variant.replace(/_/g, ' ')}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                      {component.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {component.preview_image && (
                    <img 
                      src={component.preview_image} 
                      alt={component.variant}
                      className="w-full h-20 object-cover rounded border border-gray-600"
                    />
                  )}
                  
                  <Button
                    onClick={() => handleAddComponent(component)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Component
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No components found</p>
              <p className="text-sm mt-2">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
