
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface InlineStyleEditorProps {
  currentStyles: Record<string, string>;
  onSave: (newStyles: Record<string, string>) => void;
}

const fontSizes = {
  'text-xs': '0.75rem',
  'text-sm': '0.875rem',
  'text-base': '1rem',
  'text-lg': '1.125rem',
  'text-xl': '1.25rem',
  'text-2xl': '1.5rem',
  'text-3xl': '1.875rem',
  'text-4xl': '2.25rem'
};

const fontWeights = {
  'font-thin': '100',
  'font-light': '300',
  'font-normal': '400',
  'font-medium': '500',
  'font-semibold': '600',
  'font-bold': '700',
  'font-extrabold': '800'
};

const colorOptions = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#808080', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0'
];

export const InlineStyleEditor: React.FC<InlineStyleEditorProps> = ({
  currentStyles,
  onSave
}) => {
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const convertedStyles = {
      fontSize: currentStyles.fontSize || '1rem',
      fontWeight: currentStyles.fontWeight || '400',
      color: currentStyles.color || '#000000',
      backgroundColor: currentStyles.backgroundColor || 'transparent',
      margin: currentStyles.margin || '0px',
      padding: currentStyles.padding || '0px'
    };
    setStyles(convertedStyles);
  }, [currentStyles]);

  const handleStyleChange = (property: string, value: string) => {
    setStyles(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleSave = () => {
    onSave(styles);
  };

  return (
    <div className="space-y-6">
      {/* Typography */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Typography</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white text-sm">Font Size</Label>
            <Select
              value={Object.keys(fontSizes).find(key => fontSizes[key as keyof typeof fontSizes] === styles.fontSize) || ''}
              onValueChange={(value) => handleStyleChange('fontSize', fontSizes[value as keyof typeof fontSizes])}
            >
              <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-[#272725] border-gray-600">
                {Object.entries(fontSizes).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-[#1c1c1c]">
                    {key.replace('text-', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white text-sm">Font Weight</Label>
            <Select
              value={Object.keys(fontWeights).find(key => fontWeights[key as keyof typeof fontWeights] === styles.fontWeight) || ''}
              onValueChange={(value) => handleStyleChange('fontWeight', fontWeights[value as keyof typeof fontWeights])}
            >
              <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent className="bg-[#272725] border-gray-600">
                {Object.entries(fontWeights).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-[#1c1c1c]">
                    {key.replace('font-', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Colors</h3>
        
        <div>
          <Label className="text-white text-sm">Text Color</Label>
          <div className="flex gap-2 flex-wrap mt-2">
            {colorOptions.map(color => (
              <button
                key={color}
                className="w-8 h-8 rounded border-2 border-gray-600 hover:border-white transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => handleStyleChange('color', color)}
              />
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white text-sm">Background Color</Label>
          <div className="flex gap-2 flex-wrap mt-2">
            {colorOptions.map(color => (
              <button
                key={color}
                className="w-8 h-8 rounded border-2 border-gray-600 hover:border-white transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => handleStyleChange('backgroundColor', color)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          className="bg-black hover:bg-black/80 text-white"
        >
          Apply Styles
        </Button>
      </div>
    </div>
  );
};
