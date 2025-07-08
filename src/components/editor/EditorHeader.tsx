
import { Monitor, Tablet, Smartphone, Settings, Home, Save, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EditorHeader = () => {
  const { state, setPreviewMode, saveProject, currentProject } = useEditor();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSaveProject = async () => {
    if (!currentProject) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      await saveProject();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save project:', error);
      setSaveStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Project Saved';
      default:
        return 'Save Project';
    }
  };

  const responsiveOptions = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1c1c1c] border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-[#272725] hidden sm:flex"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-[#272725] sm:hidden"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          <div className="text-white font-medium hidden sm:block">
            {currentProject?.name || 'Untitled Project'}
          </div>
        </div>

        {/* Center - Responsive Controls (Desktop) */}
        <div className="hidden md:flex items-center space-x-2 bg-[#272725] rounded-lg p-1">
          {responsiveOptions.map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={state.previewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode(mode)}
              className={
                state.previewMode === mode
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#1c1c1c]"
              }
            >
              <Icon className="w-4 h-4" />
              <span className="ml-1 hidden lg:inline">{label}</span>
            </Button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="text-white hover:bg-[#272725] hidden sm:flex"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleSaveProject}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {getSaveButtonText()}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-3 pb-3 border-t border-gray-700 pt-3">
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate('/dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="text-white hover:bg-[#272725] justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate('/settings');
                setIsMobileMenuOpen(false);
              }}
              className="text-white hover:bg-[#272725] justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            {/* Mobile responsive controls */}
            <div className="pt-2 border-t border-gray-600">
              <p className="text-gray-400 text-xs mb-2 px-2">Preview Mode</p>
              <div className="flex flex-col space-y-1">
                {responsiveOptions.map(({ mode, icon: Icon, label }) => (
                  <Button
                    key={mode}
                    variant={state.previewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setPreviewMode(mode);
                      setIsMobileMenuOpen(false);
                    }}
                    className={
                      state.previewMode === mode
                        ? "bg-blue-600 text-white justify-start"
                        : "text-gray-400 hover:text-white hover:bg-[#272725] justify-start"
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
