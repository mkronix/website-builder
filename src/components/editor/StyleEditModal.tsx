
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface StyleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const fontFamilies = {
  'font-sans': 'ui-sans-serif, system-ui, sans-serif',
  'font-serif': 'ui-serif, Georgia, serif',
  'font-mono': 'ui-monospace, monospace'
};

const spacingValues = {
  '0': '0px',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem'
};

const colorOptions = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#808080', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

export const StyleEditModal: React.FC<StyleEditModalProps> = ({
  isOpen,
  onClose,
  currentStyles,
  onSave
}) => {
  const [styles, setStyles] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [customBgColor, setCustomBgColor] = useState('#FFFFFF');

  useEffect(() => {
    // Convert current styles to proper format
    const convertedStyles = {
      fontSize: currentStyles.fontSize || '1rem',
      fontWeight: currentStyles.fontWeight || '400',
      fontFamily: currentStyles.fontFamily || 'ui-sans-serif, system-ui, sans-serif',
      color: currentStyles.color || '#000000',
      backgroundColor: currentStyles.backgroundColor || 'transparent',
      margin: currentStyles.margin || '0px',
      padding: currentStyles.padding || '0px',
      customClasses: '',
      customCSS: ''
    };
    setStyles(convertedStyles);
  }, [currentStyles, isOpen]);

  const handleStyleChange = (property: string, value: string) => {
    setStyles(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleTailwindToCSS = (property: string, tailwindClass: string) => {
    let cssValue = '';

    if (property === 'fontSize' && tailwindClass in fontSizes) {
      cssValue = fontSizes[tailwindClass as keyof typeof fontSizes];
    } else if (property === 'fontWeight' && tailwindClass in fontWeights) {
      cssValue = fontWeights[tailwindClass as keyof typeof fontWeights];
    } else if (property === 'fontFamily' && tailwindClass in fontFamilies) {
      cssValue = fontFamilies[tailwindClass as keyof typeof fontFamilies];
    } else if ((property === 'margin' || property === 'padding') && tailwindClass in spacingValues) {
      cssValue = spacingValues[tailwindClass as keyof typeof spacingValues];
    }

    if (cssValue) {
      handleStyleChange(property, cssValue);
    }
  };

  const handleSave = () => {
    onSave(styles);
    onClose();
  };

  const applyColorFromPicker = (type: 'text' | 'background') => {
    const color = type === 'text' ? customColor : customBgColor;
    const property = type === 'text' ? 'color' : 'backgroundColor';
    handleStyleChange(property, color);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1c1c] border-gray-600 text-white max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Style Editor</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Typography</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-sm">Font Family</Label>
                <Select
                  value={Object.keys(fontFamilies).find(key => fontFamilies[key as keyof typeof fontFamilies] === styles.fontFamily) || ''}
                  onValueChange={(value) => handleTailwindToCSS('fontFamily', value)}
                >
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {Object.entries(fontFamilies).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-[#1c1c1c]">
                        {key.replace('font-', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm">Font Size</Label>
                <Select
                  value={Object.keys(fontSizes).find(key => fontSizes[key as keyof typeof fontSizes] === styles.fontSize) || ''}
                  onValueChange={(value) => handleTailwindToCSS('fontSize', value)}
                >
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {Object.entries(fontSizes).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-[#1c1c1c]">
                        {key.replace('text-', '')} ({value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-white text-sm">Font Weight</Label>
              <Select
                value={Object.keys(fontWeights).find(key => fontWeights[key as keyof typeof fontWeights] === styles.fontWeight) || ''}
                onValueChange={(value) => handleTailwindToCSS('fontWeight', value)}
              >
                <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent className="bg-[#272725] border-gray-600">
                  {Object.entries(fontWeights).map(([key, value]) => (
                    <SelectItem key={key} value={key} className="text-white hover:bg-[#1c1c1c]">
                      {key.replace('font-', '')} ({value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Colors</h3>

            <div className="space-y-4">
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
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-8 h-8 rounded border border-gray-600"
                  />
                  <Button
                    size="sm"
                    onClick={() => applyColorFromPicker('text')}
                    className="bg-black hover:bg-black/30 text-white"
                  >
                    Apply Custom
                  </Button>
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
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="w-8 h-8 rounded border border-gray-600"
                  />
                  <Button
                    size="sm"
                    onClick={() => applyColorFromPicker('background')}
                    className="bg-black hover:bg-black/30 text-white"
                  >
                    Apply Custom
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Spacing</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-sm">Margin</Label>
                <Select
                  value={Object.keys(spacingValues).find(key => spacingValues[key as keyof typeof spacingValues] === styles.margin) || ''}
                  onValueChange={(value) => handleTailwindToCSS('margin', value)}
                >
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select margin" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {Object.entries(spacingValues).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-[#1c1c1c]">
                        {key} ({value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm">Padding</Label>
                <Select
                  value={Object.keys(spacingValues).find(key => spacingValues[key as keyof typeof spacingValues] === styles.padding) || ''}
                  onValueChange={(value) => handleTailwindToCSS('padding', value)}
                >
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select padding" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {Object.entries(spacingValues).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-[#1c1c1c]">
                        {key} ({value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="flex items-center gap-2 text-white hover:text-black transition-colors">
              {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span>Show Advanced</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div>
                <Label className="text-white text-sm">Custom Tailwind Classes</Label>
                <Input
                  value={styles.customClasses || ''}
                  onChange={(e) => handleStyleChange('customClasses', e.target.value)}
                  placeholder="Enter Tailwind classes..."
                  className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white text-sm">Custom CSS</Label>
                <textarea
                  value={styles.customCSS || ''}
                  onChange={(e) => handleStyleChange('customCSS', e.target.value)}
                  placeholder="Enter custom CSS..."
                  className="w-full p-2 bg-[#272725] border border-gray-600 text-white placeholder:text-gray-400 rounded-md resize-none"
                  rows={4}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-white hover:bg-[#272725]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black hover:bg-black/30 text-white"
            >
              Apply Styles
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
