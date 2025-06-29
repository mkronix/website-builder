
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';
import { Monitor, Tablet, Smartphone, Download, Settings, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EditorHeader = () => {
  const { state, setPreviewMode, toggleDarkMode } = useEditor();
  const [credits] = useState(3);

  const previewModes = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-900">Website Builder</h1>
        <div className="flex items-center space-x-2">
          {state.pages.map((page) => (
            <Button
              key={page.id}
              variant={state.currentPage === page.id ? "default" : "ghost"}
              size="sm"
              onClick={() => {}}
              className="text-sm"
            >
              {page.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Preview Mode Switcher */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {previewModes.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={cn(
                "flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                state.previewMode === mode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
              title={label}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="p-2"
        >
          {state.isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="p-2">
          <Settings className="h-4 w-4" />
        </Button>

        {/* Credits & Export */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Credits: {credits}</span>
        </div>
        
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Export Project
        </Button>
      </div>
    </header>
  );
};
