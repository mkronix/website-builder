
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

const fontFamilies = [
  'font-sans', 'font-serif', 'font-mono'
];

const fontSizes = [
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'
];

const fontWeights = [
  'font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold'
];

const colorOptions = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#808080', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0'
];

const spacingOptions = [
  '0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'
];

export const StyleEditModal: React.FC<StyleEditModalProps> = ({
  isOpen,
  onClose,
  currentStyles,
  onSave
}) => {
  const [styles, setStyles] = useState<Record<string, string>>(currentStyles);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [customBgColor, setCustomBgColor] = useState('#FFFFFF');

  useEffect(() => {
    setStyles(currentStyles);
  }, [currentStyles]);

  const handleStyleChange = (property: string, value: string) => {
    setStyles(prev => ({
      ...prev,
      [property]: value
    }));
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
                <Select value={styles.fontFamily || ''} onValueChange={(value) => handleStyleChange('fontFamily', value)}>
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {fontFamilies.map(font => (
                      <SelectItem key={font} value={font} className="text-white hover:bg-[#1c1c1c]">
                        {font.replace('font-', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-white text-sm">Font Size</Label>
                <Select value={styles.fontSize || ''} onValueChange={(value) => handleStyleChange('fontSize', value)}>
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {fontSizes.map(size => (
                      <SelectItem key={size} value={size} className="text-white hover:bg-[#1c1c1c]">
                        {size.replace('text-', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-white text-sm">Font Weight</Label>
              <Select value={styles.fontWeight || ''} onValueChange={(value) => handleStyleChange('fontWeight', value)}>
                <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent className="bg-[#272725] border-gray-600">
                  {fontWeights.map(weight => (
                    <SelectItem key={weight} value={weight} className="text-white hover:bg-[#1c1c1c]">
                      {weight.replace('font-', '')}
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
                      className="w-8 h-8 rounded border-2 border-gray-600"
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
                    className="w-8 h-8 rounded"
                  />
                  <Button
                    size="sm"
                    onClick={() => applyColorFromPicker('text')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
                      className="w-8 h-8 rounded border-2 border-gray-600"
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
                    className="w-8 h-8 rounded"
                  />
                  <Button
                    size="sm"
                    onClick={() => applyColorFromPicker('background')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
                <Select value={styles.margin || ''} onValueChange={(value) => handleStyleChange('margin', `m-${value}`)}>
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select margin" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {spacingOptions.map(space => (
                      <SelectItem key={space} value={space} className="text-white hover:bg-[#1c1c1c]">
                        {space}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-white text-sm">Padding</Label>
                <Select value={styles.padding || ''} onValueChange={(value) => handleStyleChange('padding', `p-${value}`)}>
                  <SelectTrigger className="bg-[#272725] border-gray-600 text-white">
                    <SelectValue placeholder="Select padding" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#272725] border-gray-600">
                    {spacingOptions.map(space => (
                      <SelectItem key={space} value={space} className="text-white hover:bg-[#1c1c1c]">
                        {space}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="flex items-center gap-2 text-white hover:text-blue-400">
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
                  className="bg-[#272725] border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white text-sm">Custom CSS</Label>
                <textarea
                  value={styles.customCSS || ''}
                  onChange={(e) => handleStyleChange('customCSS', e.target.value)}
                  placeholder="Enter custom CSS..."
                  className="w-full p-2 bg-[#272725] border border-gray-600 text-white rounded-md resize-none"
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Styles
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
