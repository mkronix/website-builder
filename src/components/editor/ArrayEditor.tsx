
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { FileUploadSection } from './FileUploadSection';

interface ArrayEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export const ArrayEditor: React.FC<ArrayEditorProps> = ({ data, onChange }) => {
  const handleArrayItemChange = (index: number, value: any) => {
    const newData = [...data];
    newData[index] = value;
    onChange(newData);
  };

  const addArrayItem = () => {
    onChange([...data, '']);
  };

  const removeArrayItem = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const isFileItem = (item: any) => {
    return typeof item === 'string' && (item.includes('.') && (item.includes('jpg') || item.includes('png') || item.includes('mp4')));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">Array Items ({data.length})</Label>
        <Button
          size="sm"
          onClick={addArrayItem}
          className="bg-primary text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>
      
      {data.map((item: any, index: number) => (
        <div key={index} className="flex items-start gap-2 p-3 border border-border rounded">
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground">Item {index + 1}</Label>
            {isFileItem(item) ? (
              <FileUploadSection
                value={item}
                onChange={(value) => handleArrayItemChange(index, value)}
                index={index}
              />
            ) : (
              <Textarea
                value={item}
                onChange={(e) => handleArrayItemChange(index, e.target.value)}
                className="mt-1 bg-background border-input"
                rows={2}
              />
            )}
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => removeArrayItem(index)}
            className="mt-6"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
