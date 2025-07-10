
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, Play, Pause } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUploadSection } from './FileUploadSection';
import { ArrayEditor } from './ArrayEditor';
import { ObjectEditor } from './ObjectEditor';
import { StringEditor } from './StringEditor';

interface DynamicFieldEditorProps {
  data: any;
  dataKey: string;
  onSave: (key: string, value: any) => void;
  onClose: () => void;
}

export const DynamicFieldEditor: React.FC<DynamicFieldEditorProps> = ({
  data,
  dataKey,
  onSave,
  onClose
}) => {
  const [currentData, setCurrentData] = useState(data);

  const handleSave = useCallback(() => {
    onSave(dataKey, currentData);
    onClose();
  }, [currentData, dataKey, onSave, onClose]);

  const getDataType = () => {
    if (Array.isArray(currentData)) return 'Array';
    if (typeof currentData === 'object' && currentData !== null) return 'Object';
    return 'String';
  };

  const renderEditor = () => {
    if (Array.isArray(currentData)) {
      return (
        <ArrayEditor
          data={currentData}
          onChange={setCurrentData}
        />
      );
    }
    
    if (typeof currentData === 'object' && currentData !== null) {
      return (
        <ObjectEditor
          data={currentData}
          onChange={setCurrentData}
        />
      );
    }
    
    return (
      <StringEditor
        data={currentData}
        onChange={setCurrentData}
      />
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border-border text-foreground max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Edit {dataKey} ({getDataType()})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {renderEditor()}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/80"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
