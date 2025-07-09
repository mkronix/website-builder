
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: { name: string; description: string }) => void;
  currentProject?: {
    name?: string;
    description?: string;
  } | null;
  isUpdate?: boolean;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProject,
  isUpdate = false
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProjectName(currentProject?.name || '');
      setProjectDescription(currentProject?.description || '');
    }
  }, [isOpen, currentProject]);

  const handleSave = () => {
    if (projectName.trim()) {
      onSave({
        name: projectName.trim(),
        description: projectDescription.trim()
      });
      onClose();
    }
  };

  const handleClose = () => {
    setProjectName('');
    setProjectDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-[#1c1c1c] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isUpdate ? 'Update Project' : 'Save Project'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="project-name" className="text-white">
              Project Name *
            </Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="project-description" className="text-white">
              Description
            </Label>
            <Textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description..."
              className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400 mt-2"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-600 text-white bg-[#272725] hover:bg-[#272725]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!projectName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUpdate ? 'Update' : 'Save'} Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
