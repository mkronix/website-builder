import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Settings, User, FolderOpen, Layout } from 'lucide-react';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { ProjectsPage } from '@/components/projects/ProjectsPage';
import { TemplatesPage } from '@/components/templates/TemplatesPage';

type ViewMode = 'editor' | 'dashboard' | 'settings' | 'projects' | 'templates';
type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export const EditorHeader = () => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [currentView, setCurrentView] = useState<ViewMode>('editor');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <UserDashboard />;
      case 'settings':
        return <SettingsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'templates':
        return <TemplatesPage />;
      default:
        return null;
    }
  };

  if (currentView !== 'editor') {
    return (
      <div>
        <header className="h-16 bg-[#1c1c1c] border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Website Builder</h1>
            <nav className="flex space-x-4">
              <Button
                variant={currentView === 'editor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('editor')}
                className="text-gray-300 hover:text-white"
              >
                Editor
              </Button>
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className="text-gray-300 hover:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'projects' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('projects')}
                className="text-gray-300 hover:text-white"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Projects
              </Button>
              <Button
                variant={currentView === 'templates' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('templates')}
                className="text-gray-300 hover:text-white"
              >
                <Layout className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button
                variant={currentView === 'settings' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('settings')}
                className="text-gray-300 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </header>
        {renderCurrentView()}
      </div>
    );
  }

  return (
    <header className="h-16 bg-[#1c1c1c] border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">Website Builder</h1>
        <nav className="flex space-x-4">
          <Button
            variant={currentView === 'editor' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('editor')}
            className="text-gray-300 hover:text-white"
          >
            Editor
          </Button>
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('dashboard')}
            className="text-gray-300 hover:text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={currentView === 'projects' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('projects')}
            className="text-gray-300 hover:text-white"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Projects
          </Button>
          <Button
            variant={currentView === 'templates' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('templates')}
            className="text-gray-300 hover:text-white"
          >
            <Layout className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button
            variant={currentView === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('settings')}
            className="text-gray-300 hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Preview Mode Controls */}
        <div className="flex items-center space-x-2 bg-[#272725] rounded-lg p-1">
          <Button
            size="sm"
            variant={previewMode === 'desktop' ? 'default' : 'ghost'}
            onClick={() => setPreviewMode('desktop')}
            className="text-gray-300 hover:text-white"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={previewMode === 'tablet' ? 'default' : 'ghost'}
            onClick={() => setPreviewMode('tablet')}
            className="text-gray-300 hover:text-white"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={previewMode === 'mobile' ? 'default' : 'ghost'}
            onClick={() => setPreviewMode('mobile')}
            className="text-gray-300 hover:text-white"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Export Project
        </Button>
      </div>
    </header>
  );
};
