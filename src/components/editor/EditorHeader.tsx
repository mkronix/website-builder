

import { Monitor, Tablet, Smartphone, Settings, Home, Menu, X, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveProjectModal } from './SaveProjectModal';
import { exportProject } from '@/utils/projectExporter';

export const EditorHeader = () => {
  const { state, setPreviewMode, currentProject, saveProject } = useEditor();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  const responsiveOptions = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  const handleSaveProject = (projectData: { name: string; description: string }) => {
    saveProject(projectData);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

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
          created_at: (currentProject?.createdAt || new Date()).toISOString(),
          updated_at: new Date().toISOString()
        },
        pages: state.pages.map(page => ({
          id: page.id,
          name: page.name,
          slug: page.name ? `/${page.name.toLowerCase().replace(/\s+/g, '-')}` : '/',
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
      }, [] as any[]);

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
    } finally {
      setIsExporting(false);
    }
  };

  const isProjectSaved = Boolean(currentProject?.name);

  return (
    <>
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
          <div className="hidden md:flex items-center space-x-1 bg-[#272725] rounded-lg p-1">
            {responsiveOptions.map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={state.previewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode(mode)}
                className={
                  state.previewMode === mode
                    ? "bg-[#1c1c1c] text-white"
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
              onClick={handleExport}
              disabled={isExporting}
              className="text-white hover:bg-[#272725] bg-[#272725]"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                {isExporting ? 'Exporting...' : 'Export'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSaveModal(true)}
              className="text-white hover:bg-[#272725] bg-[#272725]"
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                {isProjectSaved ? 'Update Project' : 'Save Project'}
              </span>
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
                  handleExport();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isExporting}
                className="text-white hover:bg-[#272725] justify-start bg-[#272725]"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSaveModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:bg-[#272725] justify-start bg-[#272725]"
              >
                <Save className="w-4 h-4 mr-2" />
                {isProjectSaved ? 'Update Project' : 'Save Project'}
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
                          ? "bg-[#272725] text-white justify-start"
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

      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveProject}
        currentProject={currentProject}
        isUpdate={Boolean(isProjectSaved)}
      />
    </>
  );
};

