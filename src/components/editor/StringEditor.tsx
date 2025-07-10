
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadSection } from './FileUploadSection';

interface StringEditorProps {
  data: string;
  onChange: (data: string) => void;
}

export const StringEditor: React.FC<StringEditorProps> = ({ data, onChange }) => {
  const isFile = typeof data === 'string' && (data.includes('.') && (data.includes('jpg') || data.includes('png') || data.includes('mp4')));
  
  return (
    <div className="space-y-4">
      <Label className="text-foreground">Value</Label>
      {isFile ? (
        <FileUploadSection
          value={data}
          onChange={onChange}
        />
      ) : (
        <Textarea
          value={data}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background border-input"
          rows={4}
        />
      )}
    </div>
  );
};
