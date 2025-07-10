
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { FileUploadSection } from './FileUploadSection';

interface ObjectEditorProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export const ObjectEditor: React.FC<ObjectEditorProps> = ({ data, onChange }) => {
  const handleObjectPropertyChange = (key: string, value: any) => {
    onChange({ ...data, [key]: value });
  };

  const addObjectProperty = () => {
    const newKey = `property_${Object.keys(data).length + 1}`;
    onChange({ ...data, [newKey]: '' });
  };

  const removeObjectProperty = (key: string) => {
    const { [key]: removed, ...rest } = data;
    onChange(rest);
  };

  const isFileValue = (value: any) => {
    return typeof value === 'string' && (value.includes('.') && (value.includes('jpg') || value.includes('png') || value.includes('mp4')));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">Object Properties</Label>
        <Button
          size="sm"
          onClick={addObjectProperty}
          className="bg-primary text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Property
        </Button>
      </div>
      
      {Object.entries(data).map(([key, value]: [string, any]) => (
        <div key={key} className="flex items-start gap-2 p-3 border border-border rounded">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground w-20">Key:</Label>
              <Input
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const { [key]: oldValue, ...rest } = data;
                  onChange({ ...rest, [newKey]: oldValue });
                }}
                className="bg-background border-input"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Value:</Label>
              {isFileValue(value) ? (
                <FileUploadSection
                  value={value}
                  onChange={(newValue) => handleObjectPropertyChange(key, newValue)}
                  index={Object.keys(data).indexOf(key)}
                />
              ) : (
                <Textarea
                  value={value}
                  onChange={(e) => handleObjectPropertyChange(key, e.target.value)}
                  className="mt-1 bg-background border-input"
                  rows={2}
                />
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => removeObjectProperty(key)}
            className="mt-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
