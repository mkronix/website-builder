
import React, { useState, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { PropertyEditor } from './PropertyEditor';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RotateCcw, X } from 'lucide-react';

export const ComponentCustomizer: React.FC = () => {
  const { state, updateComponent, selectComponent } = useEditor();
  const [localProps, setLocalProps] = useState<Record<string, any>>({});
  const [customClasses, setCustomClasses] = useState<Record<string, string>>({});

  const selectedComponent = state.pages
    .find(page => page.id === state.currentPage)
    ?.components.find(comp => comp.id === state.selectedComponent);

  useEffect(() => {
    if (selectedComponent) {
      setLocalProps({ ...selectedComponent.default_props });
      setCustomClasses({});
    }
  }, [selectedComponent]);

  if (!selectedComponent) {
    return (
      <div className="p-6 text-center text-gray-400">
        <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
        <p className="text-sm">Select a component from the canvas to customize its properties</p>
      </div>
    );
  }

  const getPropertyDefinitions = () => {
    const props = selectedComponent.customizableProps || {};
    const definitions = [];

    for (const [key, config] of Object.entries(props)) {
      if (typeof config === 'object' && config !== null) {
        definitions.push({
          key,
          type: config.type || 'text',
          label: config.label || key,
          value: localProps[key],
          options: config.options,
          placeholder: config.placeholder,
          description: config.description
        });
      }
    }

    // Add common properties for all components
    const commonProps = [
      {
        key: 'className',
        type: 'text' as const,
        label: 'CSS Classes',
        value: localProps.className || '',
        placeholder: 'Enter custom CSS classes',
        description: 'Additional CSS classes for styling'
      }
    ];

    return [...definitions, ...commonProps];
  };

  const handlePropertyChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
  };

  const handleTailwindChange = (key: string, classes: string) => {
    setCustomClasses(prev => ({ ...prev, [key]: classes }));
    
    // Apply classes immediately to the component
    const currentClasses = localProps.className || '';
    const newClasses = `${currentClasses} ${classes}`.trim();
    handlePropertyChange('className', newClasses);
  };

  const saveChanges = () => {
    updateComponent(state.currentPage, selectedComponent.id, {
      default_props: localProps
    });
  };

  const resetChanges = () => {
    setLocalProps({ ...selectedComponent.default_props });
    setCustomClasses({});
  };

  const closeCustomizer = () => {
    selectComponent(null);
  };

  const propertyDefinitions = getPropertyDefinitions();

  return (
    <div className="w-80 bg-[#1c1c1c] border-l border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold text-lg">Customize Component</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeCustomizer}
            className="text-gray-400 hover:text-white hover:bg-[#272725]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            {selectedComponent.category}
          </Badge>
          <span className="text-gray-400 text-sm">ID: {selectedComponent.id}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {propertyDefinitions.length > 0 ? (
            propertyDefinitions.map((property) => (
              <PropertyEditor
                key={property.key}
                property={property}
                onChange={handlePropertyChange}
                onTailwindChange={handleTailwindChange}
              />
            ))
          ) : (
            <Card className="bg-[#272725] border-gray-600">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No customizable properties available for this component.</p>
              </CardContent>
            </Card>
          )}

          {Object.keys(customClasses).length > 0 && (
            <>
              <Separator className="bg-gray-600" />
              <Card className="bg-[#272725] border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Applied Custom Classes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(customClasses).map(([key, classes]) => (
                    <div key={key} className="p-2 bg-[#1c1c1c] rounded text-xs">
                      <span className="text-blue-300">{key}:</span>
                      <span className="text-white font-mono ml-2">{classes}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-700 space-y-2">
        <Button
          onClick={saveChanges}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button
          onClick={resetChanges}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-[#272725] hover:text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
};
