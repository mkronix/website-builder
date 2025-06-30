
import React, { useState, useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RotateCcw, X, Palette, Code } from 'lucide-react';

export const ComponentCustomizer: React.FC = () => {
  const { state, updateComponent, selectComponent } = useEditor();
  const [localProps, setLocalProps] = useState<Record<string, any>>({});
  const [customTailwind, setCustomTailwind] = useState('');
  const [customCss, setCustomCss] = useState('');

  const selectedComponent = state.pages
    .find(page => page.id === state.currentPage)
    ?.components.find(comp => comp.id === state.selectedComponent);

  useEffect(() => {
    if (selectedComponent) {
      setLocalProps({ ...selectedComponent.default_props });
      setCustomTailwind(selectedComponent.customTailwindClass || '');
      setCustomCss(selectedComponent.customStyleCss || '');
    }
  }, [selectedComponent]);

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-[#1c1c1c] border-l border-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
          <p className="text-sm">Select a component to customize</p>
        </div>
      </div>
    );
  }

  const extractEditableProps = () => {
    const props = selectedComponent.default_props || {};
    const editableProps: Array<{key: string, value: any, type: string}> = [];

    const traverseProps = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'string') {
          editableProps.push({ key: fullKey, value, type: 'text' });
        } else if (typeof value === 'number') {
          editableProps.push({ key: fullKey, value, type: 'number' });
        } else if (typeof value === 'boolean') {
          editableProps.push({ key: fullKey, value, type: 'boolean' });
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Handle nested objects like {src: "", alt: ""}
          if (value.src !== undefined || value.href !== undefined || value.text !== undefined) {
            editableProps.push({ key: fullKey, value, type: 'object' });
          } else {
            traverseProps(value, fullKey);
          }
        } else if (Array.isArray(value)) {
          editableProps.push({ key: fullKey, value, type: 'array' });
        }
      });
    };

    traverseProps(props);
    return editableProps;
  };

  const handlePropChange = (key: string, value: any) => {
    const keys = key.split('.');
    const newProps = { ...localProps };
    
    let current = newProps;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setLocalProps(newProps);
  };

  const saveChanges = () => {
    updateComponent(state.currentPage, selectedComponent.id, {
      default_props: localProps,
      customTailwindClass: customTailwind,
      customStyleCss: customCss
    });
  };

  const resetChanges = () => {
    setLocalProps({ ...selectedComponent.default_props });
    setCustomTailwind(selectedComponent.customTailwindClass || '');
    setCustomCss(selectedComponent.customStyleCss || '');
  };

  const renderPropEditor = (prop: {key: string, value: any, type: string}) => {
    switch (prop.type) {
      case 'text':
        return (
          <Input
            value={prop.value || ''}
            onChange={(e) => handlePropChange(prop.key, e.target.value)}
            className="bg-[#272725] border-gray-600 text-white"
            placeholder="Enter text..."
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={prop.value || 0}
            onChange={(e) => handlePropChange(prop.key, parseInt(e.target.value))}
            className="bg-[#272725] border-gray-600 text-white"
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={prop.value || false}
              onChange={(e) => handlePropChange(prop.key, e.target.checked)}
              className="rounded border-gray-600 bg-[#272725]"
            />
            <span className="text-white text-sm">
              {prop.value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );

      case 'object':
        return (
          <div className="space-y-2">
            {Object.entries(prop.value || {}).map(([subKey, subValue]) => (
              <div key={subKey}>
                <Label className="text-white text-xs capitalize">{subKey}</Label>
                <Input
                  value={subValue as string || ''}
                  onChange={(e) => handlePropChange(prop.key, {
                    ...prop.value,
                    [subKey]: e.target.value
                  })}
                  className="bg-[#272725] border-gray-600 text-white"
                  placeholder={`Enter ${subKey}...`}
                />
              </div>
            ))}
          </div>
        );

      case 'array':
        return (
          <Textarea
            value={JSON.stringify(prop.value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handlePropChange(prop.key, parsed);
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            rows={4}
            className="bg-[#272725] border-gray-600 text-white font-mono text-xs"
            placeholder="JSON array..."
          />
        );

      default:
        return (
          <Input
            value={String(prop.value || '')}
            onChange={(e) => handlePropChange(prop.key, e.target.value)}
            className="bg-[#272725] border-gray-600 text-white"
          />
        );
    }
  };

  const editableProps = extractEditableProps();

  return (
    <div className="w-80 bg-[#1c1c1c] border-l border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold text-lg">Customize</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectComponent(null)}
            className="text-gray-400 hover:text-white hover:bg-[#272725]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-blue-300 text-sm">{selectedComponent.category}</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#272725]">
              <TabsTrigger value="content" className="data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white text-gray-400">
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white text-gray-400">
                <Code className="w-3 h-3 mr-1" />
                Style
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              {editableProps.length > 0 ? (
                editableProps.map((prop) => (
                  <Card key={prop.key} className="bg-[#272725] border-gray-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm capitalize">
                        {prop.key.replace(/[._]/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderPropEditor(prop)}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No editable content found
                </div>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              <Card className="bg-[#272725] border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Tailwind Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customTailwind}
                    onChange={(e) => setCustomTailwind(e.target.value)}
                    placeholder="Enter Tailwind CSS classes..."
                    rows={3}
                    className="bg-[#1c1c1c] border-gray-600 text-white font-mono text-xs"
                  />
                </CardContent>
              </Card>

              <Card className="bg-[#272725] border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Custom CSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    placeholder="Enter custom CSS..."
                    rows={4}
                    className="bg-[#1c1c1c] border-gray-600 text-white font-mono text-xs"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
          Reset
        </Button>
      </div>
    </div>
  );
};
