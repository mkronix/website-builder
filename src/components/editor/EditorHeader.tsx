
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEditor } from '@/contexts/EditorContext';
import {
  ArrowLeft,
  FolderOpen,
  Monitor,
  Save,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EditorHeader = () => {
  const navigate = useNavigate();
  const { state, setPreviewMode, saveProject, currentProject } = useEditor();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState(currentProject?.name || '');
  const [projectDescription, setProjectDescription] = useState(currentProject?.description || '');

  const handleSave = () => {
    if (projectName.trim()) {
      saveProject(projectName, projectDescription);
      setShowSaveDialog(false);
    }
  };

  const previewModes = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <>
      <header className="bg-[#1c1c1c] border-b border-gray-700 px-1 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-300 hover:text-white px-2"
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
          <div className="flex items-center bg-[#272725] rounded-lg p-1">
            {previewModes.map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={state.previewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode(mode)}
                className={`px-3 py-1 ${state.previewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <Button
            onClick={() => setShowSaveDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
