
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface StyleEditorProps {
  currentStyles: Record<string, string>;
  onSave: (styles: Record<string, string>) => void;
  onClose: () => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({
  currentStyles,
  onSave,
  onClose
}) => {
  const [styles, setStyles] = useState<Record<string, string>>(currentStyles);
  const [tailwindInput, setTailwindInput] = useState('');
  const [activeMode, setActiveMode] = useState<'quick' | 'advanced'>('quick');

  useEffect(() => {
    setStyles(currentStyles);
    setTailwindInput(currentStyles.className || '');
  }, [currentStyles]);

  // Quick style presets for common styling needs
  const quickStylePresets = [
    { name: 'Bold Text', classes: 'font-bold' },
    { name: 'Large Text', classes: 'text-lg' },
    { name: 'Extra Large Text', classes: 'text-xl' },
    { name: 'Small Text', classes: 'text-sm' },
    { name: 'Center Text', classes: 'text-center' },
    { name: 'Right Text', classes: 'text-right' },
    { name: 'Italic', classes: 'italic' },
    { name: 'Underline', classes: 'underline' },
    { name: 'Rounded Corners', classes: 'rounded-lg' },
    { name: 'Full Rounded', classes: 'rounded-full' },
    { name: 'Shadow', classes: 'shadow-md' },
    { name: 'Large Shadow', classes: 'shadow-lg' },
    { name: 'Padding Small', classes: 'p-2' },
    { name: 'Padding Medium', classes: 'p-4' },
    { name: 'Padding Large', classes: 'p-6' },
    { name: 'Margin Small', classes: 'm-2' },
    { name: 'Margin Medium', classes: 'm-4' },
    { name: 'Margin Large', classes: 'm-6' },
    { name: 'Full Width', classes: 'w-full' },
    { name: 'Auto Width', classes: 'w-auto' },
    { name: 'Flex Center', classes: 'flex items-center justify-center' },
    { name: 'Hidden', classes: 'hidden' },
    { name: 'Block', classes: 'block' },
    { name: 'Inline Block', classes: 'inline-block' },
  ];

  // Color presets that work with the theme system
  const colorPresets = [
    { name: 'Primary Background', classes: 'bg-[var(--theme-primary)]' },
    { name: 'Secondary Background', classes: 'bg-[var(--theme-secondary)]' },
    { name: 'Background', classes: 'bg-[var(--theme-background)]' },
    { name: 'Primary Text', classes: 'text-[var(--theme-primary)]' },
    { name: 'Secondary Text', classes: 'text-[var(--theme-secondary)]' },
    { name: 'Text Color', classes: 'text-[var(--theme-text)]' },
    { name: 'Transparent', classes: 'bg-transparent' },
    { name: 'White Background', classes: 'bg-white' },
    { name: 'Black Background', classes: 'bg-black' },
    { name: 'Gray Background', classes: 'bg-gray-100' },
    { name: 'Red Background', classes: 'bg-red-500' },
    { name: 'Blue Background', classes: 'bg-blue-500' },
    { name: 'Green Background', classes: 'bg-green-500' },
    { name: 'Yellow Background', classes: 'bg-yellow-500' },
    { name: 'Purple Background', classes: 'bg-purple-500' },
  ];

  const applyPreset = (classes: string) => {
    const currentClasses = tailwindInput.split(' ').filter(cls => cls.trim());
    const newClasses = classes.split(' ');

    // Remove conflicting classes and add new ones
    const combinedClasses = [...currentClasses, ...newClasses]
      .filter((cls, index, arr) => arr.indexOf(cls) === index) // Remove duplicates
      .join(' ');

    setTailwindInput(combinedClasses);
    setStyles(prev => ({ ...prev, className: combinedClasses }));
  };

  const removePreset = (classes: string) => {
    const currentClasses = tailwindInput.split(' ').filter(cls => cls.trim());
    const classesToRemove = classes.split(' ');

    const filteredClasses = currentClasses
      .filter(cls => !classesToRemove.includes(cls))
      .join(' ');

    setTailwindInput(filteredClasses);
    setStyles(prev => ({ ...prev, className: filteredClasses }));
  };

  const handleTailwindChange = (value: string) => {
    setTailwindInput(value);
    setStyles(prev => ({ ...prev, className: value }));
  };

  const handleCustomCssChange = (property: string, value: string) => {
    setStyles(prev => ({ ...prev, [property]: value }));
  };

  const handleSave = () => {
    // Ensure className is properly set from tailwindInput
    const finalStyles = {
      ...styles,
      className: tailwindInput
    };
    onSave(finalStyles);
    onClose();
  };

  const appliedClasses = tailwindInput.split(' ').filter(cls => cls.trim());

  return (
    <div className="space-y-6">
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'quick' | 'advanced')}>
        <TabsList className="grid w-full grid-cols-2 bg-[#272725] text-white">
          <TabsTrigger value="quick">Quick Style</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <div>
            <Label className="text-white mb-3 block">Style Presets</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {quickStylePresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset.classes)}
                  className="justify-start text-left bg-[#272725] border-gray-600 text-gray-300 hover:bg-[#333] hover:text-white text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-600" />

          <div>
            <Label className="text-white mb-3 block">Color Presets</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset.classes)}
                  className="justify-start text-left bg-[#272725] border-gray-600 text-gray-300 hover:bg-[#333] hover:text-white text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label className="text-white mb-2 block">TailwindCSS Classes</Label>
            <Textarea
              value={tailwindInput}
              onChange={(e) => handleTailwindChange(e.target.value)}
              placeholder="Enter Tailwind CSS classes (e.g., bg-blue-500 text-white p-4 rounded-lg)"
              className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400 min-h-[100px] font-mono text-sm"
              rows={4}
            />
            <div className="text-xs text-gray-400 mt-1">
              Separate multiple classes with spaces. Use theme variables like bg-[var(--theme-primary)] for theme integration.
            </div>
          </div>

          {appliedClasses.length > 0 && (
            <div>
              <Label className="text-white mb-2 block">Applied Classes</Label>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {appliedClasses.map((cls, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#272725] text-emerald-300 hover:bg-[#272725]/30 cursor-pointer text-xs"
                    onClick={() => removePreset(cls)}
                    title="Click to remove"
                  >
                    {cls} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-gray-600" />

          <div>
            <Label className="text-white mb-3 block">Custom CSS Properties</Label>
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
              {[
                { key: 'fontSize', label: 'Font Size', placeholder: '16px, 1rem, etc.' },
                { key: 'fontWeight', label: 'Font Weight', placeholder: 'bold, 400, etc.' },
                { key: 'color', label: 'Text Color', placeholder: '#333333, rgb(51,51,51), etc.' },
                { key: 'backgroundColor', label: 'Background Color', placeholder: '#ffffff, transparent, etc.' },
                { key: 'padding', label: 'Padding', placeholder: '10px, 1rem 2rem, etc.' },
                { key: 'margin', label: 'Margin', placeholder: '10px, 1rem 2rem, etc.' },
                { key: 'borderRadius', label: 'Border Radius', placeholder: '4px, 0.5rem, etc.' },
                { key: 'border', label: 'Border', placeholder: '1px solid #ccc' },
                { key: 'boxShadow', label: 'Box Shadow', placeholder: '0 2px 4px rgba(0,0,0,0.1)' },
                { key: 'width', label: 'Width', placeholder: '100px, 50%, auto, etc.' },
                { key: 'height', label: 'Height', placeholder: '100px, 50vh, auto, etc.' },
                { key: 'display', label: 'Display', placeholder: 'block, flex, inline, etc.' },
                { key: 'position', label: 'Position', placeholder: 'relative, absolute, etc.' },
                { key: 'zIndex', label: 'Z-Index', placeholder: '1, 10, 100, etc.' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="grid grid-cols-3 gap-2 items-center">
                  <Label className="text-gray-300 text-xs">{label}</Label>
                  <Input
                    value={styles[key] || ''}
                    onChange={(e) => handleCustomCssChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="col-span-2 bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-500 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="bg-gray-600" />

      {/* Style Preview */}
      <div>
        <Label className="text-white mb-2 block">Live Preview</Label>
        <div className="p-4 bg-[#1c1c1c] border border-gray-600 rounded-lg">
          <div
            className={tailwindInput}
            style={{
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              color: styles.color,
              backgroundColor: styles.backgroundColor,
              padding: styles.padding,
              margin: styles.margin,
              borderRadius: styles.borderRadius,
              border: styles.border,
              boxShadow: styles.boxShadow,
              width: styles.width,
              height: styles.height,
              display: styles.display,
              position: styles.position as React.CSSProperties['position'],
              zIndex: styles.zIndex,
            }}
          >
            Preview Text - This shows how your styles will look
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          onClick={onClose}
          className="border-gray-600 text-white bg-[#272725] hover:bg-[#333]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-[#272725] hover:bg-emerald-700 text-white"
        >
          Apply Styles
        </Button>
      </div>
    </div>
  );
};

export default StyleEditor;
