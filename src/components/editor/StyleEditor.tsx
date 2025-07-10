import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Brush,
  Circle,
  Code,
  Eye,
  Italic,
  Layers,
  Layout,
  Minus,
  Move,
  Palette,
  Plus,
  Save,
  Settings,
  Sliders,
  Sparkles,
  Square,
  Type,
  Underline,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

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

  // Quick style presets with icons and categories
  const quickStylePresets = [
    {
      category: 'Typography',
      icon: <Type className="w-3 h-3" />,
      items: [
        { name: 'Bold', classes: 'font-bold', icon: <Bold className="w-3 h-3" /> },
        { name: 'Italic', classes: 'italic', icon: <Italic className="w-3 h-3" /> },
        { name: 'Underline', classes: 'underline', icon: <Underline className="w-3 h-3" /> },
        { name: 'Large', classes: 'text-lg', icon: <Type className="w-3 h-3" /> },
        { name: 'XL', classes: 'text-xl', icon: <Type className="w-3 h-3" /> },
        { name: 'Small', classes: 'text-sm', icon: <Type className="w-3 h-3" /> },
      ]
    },
    {
      category: 'Alignment',
      icon: <AlignCenter className="w-3 h-3" />,
      items: [
        { name: 'Center', classes: 'text-center', icon: <AlignCenter className="w-3 h-3" /> },
        { name: 'Left', classes: 'text-left', icon: <AlignLeft className="w-3 h-3" /> },
        { name: 'Right', classes: 'text-right', icon: <AlignRight className="w-3 h-3" /> },
        { name: 'Flex Center', classes: 'flex items-center justify-center', icon: <Move className="w-3 h-3" /> },
      ]
    },
    {
      category: 'Shape',
      icon: <Square className="w-3 h-3" />,
      items: [
        { name: 'Rounded', classes: 'rounded-lg', icon: <Square className="w-3 h-3" /> },
        { name: 'Full Round', classes: 'rounded-full', icon: <Circle className="w-3 h-3" /> },
        { name: 'No Round', classes: 'rounded-none', icon: <Square className="w-3 h-3" /> },
      ]
    },
    {
      category: 'Effects',
      icon: <Sparkles className="w-3 h-3" />,
      items: [
        { name: 'Shadow', classes: 'shadow-md', icon: <Layers className="w-3 h-3" /> },
        { name: 'Large Shadow', classes: 'shadow-lg', icon: <Layers className="w-3 h-3" /> },
        { name: 'Glow', classes: 'shadow-2xl', icon: <Sparkles className="w-3 h-3" /> },
      ]
    },
    {
      category: 'Spacing',
      icon: <Layout className="w-3 h-3" />,
      items: [
        { name: 'Pad S', classes: 'p-2', icon: <Plus className="w-3 h-3" /> },
        { name: 'Pad M', classes: 'p-4', icon: <Plus className="w-3 h-3" /> },
        { name: 'Pad L', classes: 'p-6', icon: <Plus className="w-3 h-3" /> },
        { name: 'Margin S', classes: 'm-2', icon: <Move className="w-3 h-3" /> },
        { name: 'Margin M', classes: 'm-4', icon: <Move className="w-3 h-3" /> },
        { name: 'Margin L', classes: 'm-6', icon: <Move className="w-3 h-3" /> },
      ]
    },
    {
      category: 'Layout',
      icon: <Layout className="w-3 h-3" />,
      items: [
        { name: 'Full Width', classes: 'w-full', icon: <Layout className="w-3 h-3" /> },
        { name: 'Auto Width', classes: 'w-auto', icon: <Layout className="w-3 h-3" /> },
        { name: 'Block', classes: 'block', icon: <Square className="w-3 h-3" /> },
        { name: 'Inline', classes: 'inline-block', icon: <Minus className="w-3 h-3" /> },
      ]
    }
  ];

  // Color presets with gradients and modern colors
  const colorPresets = [
    {
      category: 'Theme Colors',
      items: [
        { name: 'Primary BG', classes: 'bg-[var(--theme-primary)]', color: 'var(--theme-primary)' },
        { name: 'Secondary BG', classes: 'bg-[var(--theme-secondary)]', color: 'var(--theme-secondary)' },
        { name: 'Background', classes: 'bg-[var(--theme-background)]', color: 'var(--theme-background)' },
        { name: 'Primary Text', classes: 'text-[var(--theme-primary)]', color: 'var(--theme-primary)' },
        { name: 'Secondary Text', classes: 'text-[var(--theme-secondary)]', color: 'var(--theme-secondary)' },
        { name: 'Text Color', classes: 'text-[var(--theme-text)]', color: 'var(--theme-text)' },
      ]
    },
    {
      category: 'Gradients',
      items: [
        { name: 'Sunset', classes: 'bg-gradient-to-r from-orange-500 to-pink-500', gradient: 'linear-gradient(to right, #f97316, #ec4899)' },
        { name: 'Ocean', classes: 'bg-gradient-to-r from-blue-500 to-cyan-500', gradient: 'linear-gradient(to right, #3b82f6, #06b6d4)' },
        { name: 'Forest', classes: 'bg-gradient-to-r from-green-500 to-emerald-500', gradient: 'linear-gradient(to right, #22c55e, #10b981)' },
        { name: 'Purple', classes: 'bg-gradient-to-r from-purple-500 to-pink-500', gradient: 'linear-gradient(to right, #a855f7, #ec4899)' },
        { name: 'Dark', classes: 'bg-gradient-to-r from-gray-800 to-gray-900', gradient: 'linear-gradient(to right, #1f2937, #111827)' },
      ]
    },
    {
      category: 'Solid Colors',
      items: [
        { name: 'Transparent', classes: 'bg-transparent', color: 'transparent' },
        { name: 'White', classes: 'bg-white', color: '#ffffff' },
        { name: 'Black', classes: 'bg-black', color: '#000000' },
        { name: 'Red', classes: 'bg-red-500', color: '#ef4444' },
        { name: 'Blue', classes: 'bg-blue-500', color: '#3b82f6' },
        { name: 'Green', classes: 'bg-green-500', color: '#22c55e' },
        { name: 'Yellow', classes: 'bg-yellow-500', color: '#eab308' },
        { name: 'Purple', classes: 'bg-purple-500', color: '#a855f7' },
        { name: 'Emerald', classes: 'bg-emerald-500', color: '#10b981' },
        { name: 'Cyan', classes: 'bg-cyan-500', color: '#06b6d4' },
        { name: 'Pink', classes: 'bg-pink-500', color: '#ec4899' },
        { name: 'Orange', classes: 'bg-orange-500', color: '#f97316' },
      ]
    }
  ];

  const applyPreset = (classes: string) => {
    const currentClasses = tailwindInput.split(' ').filter(cls => cls.trim());
    const newClasses = classes.split(' ');

    const combinedClasses = [...currentClasses, ...newClasses]
      .filter((cls, index, arr) => arr.indexOf(cls) === index)
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
    const finalStyles = {
      ...styles,
      className: tailwindInput
    };
    onSave(finalStyles);
    onClose();
  };

  const appliedClasses = tailwindInput.split(' ').filter(cls => cls.trim());


  return (
    <div className="min-h-screen bg-[#1c1c1c] flex">
      {/* Left Panel - Style Controls (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brush className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Style Editor</h1>
                <p className="text-gray-400 text-sm">Customize your component styling</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl space-y-6">
            <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'quick' | 'advanced')}>
              <TabsList className="grid w-full grid-cols-2 bg-[#272725] p-1 rounded-lg">
                <TabsTrigger
                  value="quick"
                  className="flex items-center gap-2 data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white text-gray-400 rounded-md transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Quick Style
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="flex items-center gap-2 data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white text-gray-400 rounded-md transition-all"
                >
                  <Code className="w-4 h-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="space-y-6 mt-6">
                {/* Style Presets */}
                <div className="bg-[#272725] rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Style Presets</h3>
                  </div>
                  <div className="space-y-4">
                    {quickStylePresets.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          {category.icon}
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {category.items.map((preset) => (
                            <Button
                              key={preset.name}
                              onClick={() => applyPreset(preset.classes)}
                              className="flex items-center gap-2 justify-start bg-[#1c1c1c] border border-gray-600 text-gray-300 hover:bg-[#333] hover:text-white hover:border-purple-500 transition-all text-xs p-2 h-auto"
                            >
                              {preset.icon}
                              {preset.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Presets */}
                <div className="bg-[#272725] rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-pink-400" />
                    <h3 className="text-lg font-semibold text-white">Color Presets</h3>
                  </div>
                  <div className="space-y-4">
                    {colorPresets.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="text-sm text-gray-300 font-medium">{category.category}</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {category.items.map((preset) => (
                            <Button
                              key={preset.name}
                              onClick={() => applyPreset(preset.classes)}
                              className="flex items-center gap-2 justify-start bg-[#1c1c1c] border border-gray-600 text-gray-300 hover:bg-[#333] hover:text-white hover:border-pink-500 transition-all text-xs p-2 h-auto"
                            >
                              <div
                                className="w-3 h-3 rounded-full border border-gray-500"
                                style={{
                                  background: preset.gradient || preset.color,
                                  backgroundColor: preset.color
                                }}
                              />
                              {preset.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 mt-6">
                {/* Tailwind CSS Input */}
                <div className="bg-[#272725] rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Tailwind CSS Classes</h3>
                  </div>
                  <Textarea
                    value={tailwindInput}
                    onChange={(e) => handleTailwindChange(e.target.value)}
                    placeholder="Enter Tailwind CSS classes (e.g., bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors)"
                    className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-500 min-h-[120px] font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={5}
                  />
                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    Separate multiple classes with spaces. Use theme variables like bg-[var(--theme-primary)] for theme integration.
                  </div>
                </div>

                {/* Applied Classes */}
                {appliedClasses.length > 0 && (
                  <div className="bg-[#272725] rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Applied Classes</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {appliedClasses.map((cls, index) => (
                        <Badge
                          key={index}
                          onClick={() => removePreset(cls)}
                          className="bg-[#1c1c1c] text-emerald-300 hover:bg-red-900 hover:text-red-300 cursor-pointer text-xs border border-gray-600 transition-colors flex items-center gap-1 px-2 py-1"
                          title="Click to remove"
                        >
                          {cls}
                          <X className="w-3 h-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom CSS Properties */}
                <div className="bg-[#272725] rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Sliders className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">Custom CSS Properties</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
                    {[
                      { key: 'fontSize', label: 'Font Size', placeholder: '16px, 1rem, etc.', icon: <Type className="w-4 h-4" /> },
                      { key: 'fontWeight', label: 'Font Weight', placeholder: 'bold, 400, etc.', icon: <Bold className="w-4 h-4" /> },
                      { key: 'color', label: 'Text Color', placeholder: '#333333, rgb(51,51,51), etc.', icon: <Palette className="w-4 h-4" /> },
                      { key: 'backgroundColor', label: 'Background Color', placeholder: '#ffffff, transparent, etc.', icon: <Square className="w-4 h-4" /> },
                      { key: 'padding', label: 'Padding', placeholder: '10px, 1rem 2rem, etc.', icon: <Plus className="w-4 h-4" /> },
                      { key: 'margin', label: 'Margin', placeholder: '10px, 1rem 2rem, etc.', icon: <Move className="w-4 h-4" /> },
                      { key: 'borderRadius', label: 'Border Radius', placeholder: '4px, 0.5rem, etc.', icon: <Circle className="w-4 h-4" /> },
                      { key: 'border', label: 'Border', placeholder: '1px solid #ccc', icon: <Square className="w-4 h-4" /> },
                      { key: 'boxShadow', label: 'Box Shadow', placeholder: '0 2px 4px rgba(0,0,0,0.1)', icon: <Layers className="w-4 h-4" /> },
                      { key: 'width', label: 'Width', placeholder: '100px, 50%, auto, etc.', icon: <Layout className="w-4 h-4" /> },
                      { key: 'height', label: 'Height', placeholder: '100px, 50vh, auto, etc.', icon: <Layout className="w-4 h-4" /> },
                      { key: 'display', label: 'Display', placeholder: 'block, flex, inline, etc.', icon: <Layout className="w-4 h-4" /> },
                      { key: 'position', label: 'Position', placeholder: 'relative, absolute, etc.', icon: <Move className="w-4 h-4" /> },
                      { key: 'zIndex', label: 'Z-Index', placeholder: '1, 10, 100, etc.', icon: <Layers className="w-4 h-4" /> },
                    ].map(({ key, label, placeholder, icon }) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          {icon}
                          {label}
                        </Label>
                        <Input
                          value={styles[key] || ''}
                          onChange={(e) => handleCustomCssChange(key, e.target.value)}
                          placeholder={placeholder}
                          className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-500 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pb-6">
              <Button
                onClick={onClose}
                className="bg-[#272725] hover:bg-[#333] text-white border border-gray-600 hover:border-gray-500 transition-colors flex items-center gap-2 px-6"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all flex items-center gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                Apply Styles
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview (Fixed/Sticky) */}
      <div className="w-80 bg-[#1c1c1c] border-l border-gray-700/50 flex-shrink-0">
        <div className="px-3 py-6 space-y-4">
          {/* Preview Header */}
          <div className="bg-[#272725] rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Live Preview</h3>
              </div>
            </div>

            {/* Preview Container */}
            <div className="bg-[#1c1c1c] rounded-lg p-4 border border-gray-600">
              <div className={`transition-all duration-300 mx-auto`}>
                <div
                  className={tailwindInput}
                  style={{
                    fontSize: styles.fontSize,
                    fontWeight: styles.fontWeight,
                    fontFamily: styles.fontFamily,
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
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">Preview Heading</div>
                    <div>This is how your styles will look when applied to content. You can see the real-time changes as you modify the styling options.</div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-4 h-4 bg-current rounded-full opacity-50"></div>
                      <div className="text-sm opacity-75">Sample element</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Style Info */}
          <div className="bg-[#272725] rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Style Info</h4>
            </div>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Classes Applied:</span>
                <span className="text-white">{appliedClasses.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Custom CSS:</span>
                <span className="text-white">{Object.keys(styles).filter(k => k !== 'className' && styles[k]).length}</span>
              </div>
            </div>
          </div>

          {/* Current Style Values */}
          <div className="bg-[#272725] rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-semibold text-white">Current Values</h4>
            </div>
            <div className="space-y-2 text-xs text-gray-400">
              {Object.entries(styles).filter(([key, value]) => value && key !== 'className').map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-white truncate max-w-24" title={value}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;