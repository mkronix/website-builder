import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Eye, 
  Monitor, 
  Tablet, 
  Smartphone,
  Settings,
  FolderOpen,
  FileText,
  BarChart3
} from 'lucide-react';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { ProjectsPage } from '@/components/projects/ProjectsPage';
import { TemplatesPage } from '@/components/templates/TemplatesPage';
import { SettingsPage } from '@/components/settings/SettingsPage';

type ViewType = 'editor' | 'dashboard' | 'projects' | 'templates' | 'settings';

export const EditorHeader = () => {
  const { state, updateProject } = useEditor();
  const [currentView, setCurrentView] = useState<ViewType>('editor');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleSave = () => {
    console.log('Saving project...', state);
  };

  const handleExport = () => {
    console.log('Exporting project...', state);
  };

  const isViewActive = (view: ViewType) => currentView === view;

  const renderViewContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <UserDashboard />;
      case 'projects':
        return <ProjectsPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  if (currentView !== 'editor') {
    return (
      <div className="h-screen bg-[#1c1c1c]">
        <div className="bg-[#272725] border-b border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">Website Builder</h1>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('editor')}
                  className="text-gray-300 hover:text-white hover:bg-[#1c1c1c]"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Editor
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                  className={isViewActive('dashboard') ? 'text-white bg-[#1c1c1c]' : 'text-gray-300 hover:text-white hover:bg-[#1c1c1c]'}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('projects')}
                  className={isViewActive('projects') ? 'text-white bg-[#1c1c1c]' : 'text-gray-300 hover:text-white hover:bg-[#1c1c1c]'}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Projects
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('templates')}
                  className={isViewActive('templates') ? 'text-white bg-[#1c1c1c]' : 'text-gray-300 hover:text-white hover:bg-[#1c1c1c]'}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('settings')}
                  className={isViewActive('settings') ? 'text-white bg-[#1c1c1c]' : 'text-gray-300 hover:text-white hover:bg-[#1c1c1c]'}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
        {renderViewContent()}
      </div>
    );
  }

  return (
    <div className="bg-[#272725] border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">Website Builder</h1>
          <Badge variant="secondary" className="bg-blue-500 text-white">
            {state.currentPage}
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Select onValueChange={(value) => updateProject({ ...state, template: value })}>
            <SelectTrigger className="bg-[#1c1c1c] text-white border-gray-600 w-[180px]">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent className="bg-[#1c1c1c] text-white border-gray-600">
              <SelectItem value="default">Default Template</SelectItem>
              <SelectItem value="minimal">Minimal Template</SelectItem>
              <SelectItem value="modern">Modern Template</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="bg-[#1c1c1c] text-white border-gray-600 hover:bg-gray-600">
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-[#1c1c1c] text-white border-gray-600 hover:bg-gray-600">
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="bg-[#1c1c1c] text-white border-gray-600 hover:bg-gray-600" onClick={() => setViewportSize('desktop')}>
              <Monitor className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-[#1c1c1c] text-white border-gray-600 hover:bg-gray-600" onClick={() => setViewportSize('tablet')}>
              <Tablet className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-[#1c1c1c] text-white border-gray-600 hover:bg-gray-600" onClick={() => setViewportSize('mobile')}>
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
