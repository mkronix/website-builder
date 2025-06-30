
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Type, Image, Palette, Code, Eye } from 'lucide-react';

interface PropertyEditorProps {
  property: {
    key: string;
    type: 'text' | 'image' | 'color' | 'select' | 'textarea' | 'number' | 'boolean';
    label: string;
    value: any;
    options?: string[];
    placeholder?: string;
    description?: string;
  };
  onChange: (key: string, value: any) => void;
  onTailwindChange?: (key: string, classes: string) => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  property,
  onChange,
  onTailwindChange
}) => {
  const [customTailwind, setCustomTailwind] = useState('');
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');

  const handleValueChange = (value: any) => {
    onChange(property.key, value);
  };

  const handleTailwindApply = () => {
    if (onTailwindChange && customTailwind.trim()) {
      onTailwindChange(property.key, customTailwind.trim());
    }
  };

  const getPropertyIcon = () => {
    switch (property.type) {
      case 'text':
      case 'textarea':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'color':
        return <Palette className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const renderVisualEditor = () => {
    switch (property.type) {
      case 'text':
        return (
          <Input
            value={property.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={property.placeholder}
            className="bg-[#272725] border-gray-600 text-white"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={property.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={property.placeholder}
            rows={3}
            className="bg-[#272725] border-gray-600 text-white"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={property.value || 0}
            onChange={(e) => handleValueChange(parseInt(e.target.value))}
            className="bg-[#272725] border-gray-600 text-white"
          />
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={property.value || '#000000'}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-12 h-10 p-1 bg-[#272725] border-gray-600"
            />
            <Input
              value={property.value || '#000000'}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="#000000"
              className="bg-[#272725] border-gray-600 text-white"
            />
          </div>
        );

      case 'select':
        return (
          <Select value={property.value} onValueChange={handleValueChange}>
            <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent className="bg-[#272725] border-gray-600">
              {property.options?.map((option) => (
                <SelectItem key={option} value={option} className="text-white hover:bg-[#1c1c1c]">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={property.value || false}
              onChange={(e) => handleValueChange(e.target.checked)}
              className="rounded border-gray-600 bg-[#272725]"
            />
            <span className="text-white text-sm">
              {property.value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={property.value?.src || property.value || ''}
              onChange={(e) => handleValueChange({ 
                ...property.value, 
                src: e.target.value 
              })}
              placeholder="Image URL"
              className="bg-[#272725] border-gray-600 text-white"
            />
            <Input
              value={property.value?.alt || ''}
              onChange={(e) => handleValueChange({ 
                ...property.value, 
                alt: e.target.value 
              })}
              placeholder="Alt text"
              className="bg-[#272725] border-gray-600 text-white"
            />
          </div>
        );

      default:
        return (
          <Input
            value={property.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            className="bg-[#272725] border-gray-600 text-white"
          />
        );
    }
  };

  return (
    <Card className="bg-[#272725] border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          {getPropertyIcon()}
          {property.label}
          <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
            {property.type}
          </Badge>
        </CardTitle>
        {property.description && (
          <p className="text-gray-400 text-xs">{property.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'visual' | 'code')}>
          <TabsList className="grid w-full grid-cols-2 bg-[#1c1c1c]">
            <TabsTrigger 
              value="visual" 
              className="data-[state=active]:bg-[#272725] data-[state=active]:text-white text-gray-400"
            >
              <Eye className="w-3 h-3 mr-1" />
              Visual
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="data-[state=active]:bg-[#272725] data-[state=active]:text-white text-gray-400"
            >
              <Code className="w-3 h-3 mr-1" />
              Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-2">
            {renderVisualEditor()}
          </TabsContent>
          
          <TabsContent value="code" className="space-y-2">
            <div className="space-y-2">
              <Label className="text-white text-xs">Custom Tailwind Classes</Label>
              <Textarea
                value={customTailwind}
                onChange={(e) => setCustomTailwind(e.target.value)}
                placeholder="Enter Tailwind CSS classes (e.g., text-red-500 bg-blue-100 p-4)"
                rows={2}
                className="bg-[#1c1c1c] border-gray-600 text-white text-xs font-mono"
              />
              <Button
                onClick={handleTailwindApply}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Classes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
