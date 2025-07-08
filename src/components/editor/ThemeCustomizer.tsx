
import { useEditor } from '@/contexts/EditorContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Palette } from 'lucide-react';

export const ThemeCustomizer = () => {
  const { state, updateTheme } = useEditor();

  const colorPresets = [
    { name: 'Ocean Emerald', primary: '#10B981', secondary: '#059669', background: '#FFFFFF', text: '#1F2937' },
    { name: 'Forest Green', primary: '#10B981', secondary: '#059669', background: '#F9FAFB', text: '#111827' },
    { name: 'Sunset Purple', primary: '#8B5CF6', secondary: '#A855F7', background: '#FFFFFF', text: '#1F2937' },
    { name: 'Rose Pink', primary: '#EC4899', secondary: '#F472B6', background: '#FDF2F8', text: '#831843' },
    { name: 'Amber Orange', primary: '#F59E0B', secondary: '#F97316', background: '#FFFBEB', text: '#92400E' },
    { name: 'Dark Mode', primary: '#10B981', secondary: '#059669', background: '#111827', text: '#F9FAFB' },
  ];

  const applyPreset = (preset: typeof colorPresets[0]) => {
    updateTheme({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.background,
      textColor: preset.text,
    });
  };

  const handleColorChange = (colorType: keyof typeof state.theme, value: string) => {
    updateTheme({ [colorType]: value });
  };

  return (
    <div className="p-4 space-y-6 pb-10">
      {/* Color Presets */}
      <div>
        <Label className="text-sm font-semibold text-white mb-3 block">
          Quick Presets
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {colorPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="ghost"
              size="sm"
              onClick={() => applyPreset(preset)}
              className="justify-start text-gray-300 hover:text-white hover:bg-[#272725] h-auto py-3"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: preset.secondary }}
                  />
                </div>
                <span className="flex-1 text-left">{preset.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-gray-600" />

      {/* Custom Colors */}
      <div>
        <Label className="text-sm font-semibold text-white mb-3 block">
          Custom Colors
        </Label>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-400 mb-2 block">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={state.theme.primaryColor || '#10B981'}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
              />
              <Input
                value={state.theme.primaryColor || '#10B981'}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="bg-[#272725] border-gray-600 text-white text-sm"
                placeholder="#10B981"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-2 block">Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={state.theme.secondaryColor || '#059669'}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
              />
              <Input
                value={state.theme.secondaryColor || '#059669'}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="bg-[#272725] border-gray-600 text-white text-sm"
                placeholder="#059669"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-2 block">Background Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={state.theme.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
              />
              <Input
                value={state.theme.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="bg-[#272725] border-gray-600 text-white text-sm"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-2 block">Text Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={state.theme.textColor || '#1F2937'}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-transparent"
              />
              <Input
                value={state.theme.textColor || '#1F2937'}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="bg-[#272725] border-gray-600 text-white text-sm"
                placeholder="#1F2937"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-600" />

      <div>
        <Label className="text-sm font-semibold text-white mb-3 block">
          Theme Preview
        </Label>
        <div
          className="p-4 rounded-lg border border-gray-600 transition-all duration-300"
          style={{
            backgroundColor: state.theme.backgroundColor || '#FFFFFF',
            color: state.theme.textColor || '#1F2937',
          }}
        >
          <h4 className="font-semibold mb-2 transition-colors duration-300" style={{ color: state.theme.primaryColor || '#10B981' }}>
            Primary Color Text
          </h4>
          <p className="text-sm mb-2 transition-colors duration-300">
            This is how your text will look with the current theme settings.
          </p>
          <div className='flex flex-col gap-2'>
            <button
              className="px-4 py-2 rounded text-white text-sm font-medium transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: state.theme.primaryColor || '#10B981' }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded text-white text-sm font-medium transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: state.theme.secondaryColor || '#059669' }}
            >
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
