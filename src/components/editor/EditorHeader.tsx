import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEditor } from '@/contexts/EditorContext';
import {
  ArrowLeft,
  Download,
  FolderOpen,
  Monitor,
  Save,
  Smartphone,
  Tablet
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportProject } from '@/utils/projectExporter';

export const EditorHeader = () => {
  const navigate = useNavigate();
  const { state, setPreviewMode, saveProject, currentProject } = useEditor();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [projectName, setProjectName] = useState(currentProject?.name || '');
  const [projectDescription, setProjectDescription] = useState(currentProject?.description || '');

  const handleSave = () => {
    if (projectName.trim()) {
      saveProject(projectName, projectDescription);
      setShowSaveDialog(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Prepare project data for export
      const projectData = {
        project: {
          id: currentProject?.id || 'temp-id',
          name: currentProject?.name || 'React Project',
          description: currentProject?.description || 'A modern React application built with Vite and TailwindCSS',
          theme: {
            primaryColor: state.theme?.primaryColor || '#10B981',
            secondaryColor: state.theme?.secondaryColor || '#059669',
            backgroundColor: state.theme?.backgroundColor || '#F9FAFB',
            textColor: state.theme?.textColor || '#111827'
          },
          created_at: currentProject?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        pages: state.pages.map(page => ({
          id: page.id,
          name: page.name,
          slug: page.slug || `/${page.name.toLowerCase().replace(/\s+/g, '-')}`,
          components: page.components.map(component => ({
            id: component.id,
            category: component.category || 'general',
            variant: component.variant || 'default',
            default_props: component.default_props || {},
            react_code: component.react_code || `const ${component.category || 'Component'} = () => {
  return <div>Component</div>;
};`
          }))
        }))
      };

      // Get all unique components from all pages
      const allComponents = projectData.pages.reduce((acc, page) => {
        page.components.forEach(comp => {
          if (!acc.some(existing => existing.id === comp.id)) {
            acc.push(comp);
          }
        });
        return acc;
      }, []);

      // Export settings
      const exportSettings = {
        includeAnimations: true,
        includeRouting: projectData.pages.length > 1,
        typescript: false,
        prettier: true,
        includeSEO: true,
        includeAnalytics: false,
        includeSitemap: true,
        includeRobots: true
      };

      // Call the export function
      await exportProject(projectData, allComponents, exportSettings);

      console.log('Project exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const previewModes = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <>
      <header className="bg-[#1c1c1c] fixed w-full z-50 border-b border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-300 hover:text-white px-0 hover:border-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>

          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-gray-400" />
            <span className="text-white font-medium">
              {currentProject?.name || 'Untitled Project'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Mode Toggle */}
          <div className="hidden md:flex items-center bg-[#272725] rounded-lg">
            {previewModes.map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={state.previewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode(mode)}
                className={`px-3 ${state.previewMode === mode
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
                  }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          {/* Mobile Preview Mode Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modes = ['desktop', 'tablet', 'mobile'] as const;
                const currentIndex = modes.indexOf(state.previewMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                setPreviewMode(modes[nextIndex]);
              }}
              className="text-gray-400 hover:text-white"
            >
              {previewModes.find(({ mode }) => mode === state.previewMode)?.icon &&
                React.createElement(previewModes.find(({ mode }) => mode === state.previewMode)!.icon, { className: "w-4 h-4" })
              }
            </Button>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white hover:bg-gray-200 text-black disabled:opacity-50"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>

          <Button
            onClick={() => setShowSaveDialog(true)}
            className="bg-black hover:bg-black/25 text-white"
            size="default"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
        </div>
      </header>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {currentProject ? 'Update Project' : 'Save Project'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor='projectName' className="block text-sm font-medium text-gray-300 mb-2">
                Project Name
              </label>
              <Input
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor='projectDescription' className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <Textarea
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-400 hover:text-white hover:bg-[#272725]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!projectName.trim()}
                className="bg-black hover:bg-black/25 text-white"
              >
                {currentProject ? 'Update' : 'Save'} Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};