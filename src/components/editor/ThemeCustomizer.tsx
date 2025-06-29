
import { useEditor } from '@/contexts/EditorContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const ThemeCustomizer = () => {
  const { state, updateTheme } = useEditor();

  const colorPresets = [
    { name: 'Blue', primary: '#3B82F6', secondary: '#8B5CF6' },
    { name: 'Green', primary: '#10B981', secondary: '#059669' },
    { name: 'Purple', primary: '#8B5CF6', secondary: '#A855F7' },
    { name: 'Pink', primary: '#EC4899', secondary: '#F472B6' },
    { name: 'Orange', primary: '#F59E0B', secondary: '#F97316' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold text-gray-900 mb-3 block">
          Color Presets
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {colorPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => updateTheme({
                primaryColor: preset.primary,
                secondaryColor: preset.secondary,
              })}
              className="justify-start"
            >
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: preset.primary }}
              />
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold text-gray-900 mb-3 block">
          Custom Colors
        </Label>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={state.theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{state.theme.primaryColor}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-gray-600 mb-2 block">Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={state.theme.secondaryColor}
                onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{state.theme.secondaryColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold text-gray-900 mb-3 block">
          Typography
        </Label>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Font customization coming soon...</p>
        </div>
      </div>
    </div>
  );
};
