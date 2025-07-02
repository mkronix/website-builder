import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, Play, Pause } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create local URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // For now, we'll use the local URL. In production, this would upload to server
    const localPath = `/uploads/${file.name}`;
    
    if (Array.isArray(currentData)) {
      if (typeof index === 'number') {
        const newData = [...currentData];
        newData[index] = localPath;
        setCurrentData(newData);
      }
    } else {
      setCurrentData(localPath);
    }
  }, [currentData]);

  const handleArrayItemChange = useCallback((index: number, value: any) => {
    if (Array.isArray(currentData)) {
      const newData = [...currentData];
      newData[index] = value;
      setCurrentData(newData);
    }
  }, [currentData]);

  const handleObjectPropertyChange = useCallback((key: string, value: any) => {
    if (typeof currentData === 'object' && !Array.isArray(currentData)) {
      setCurrentData({ ...currentData, [key]: value });
    }
  }, [currentData]);

  const addArrayItem = useCallback(() => {
    if (Array.isArray(currentData)) {
      setCurrentData([...currentData, '']);
    }
  }, [currentData]);

  const removeArrayItem = useCallback((index: number) => {
    if (Array.isArray(currentData)) {
      const newData = currentData.filter((_, i) => i !== index);
      setCurrentData(newData);
    }
  }, [currentData]);

  const addObjectProperty = useCallback(() => {
    if (typeof currentData === 'object' && !Array.isArray(currentData)) {
      const newKey = `property_${Object.keys(currentData).length + 1}`;
      setCurrentData({ ...currentData, [newKey]: '' });
    }
  }, [currentData]);

  const removeObjectProperty = useCallback((key: string) => {
    if (typeof currentData === 'object' && !Array.isArray(currentData)) {
      const { [key]: removed, ...rest } = currentData;
      setCurrentData(rest);
    }
  }, [currentData]);

  const handleSave = useCallback(() => {
    onSave(dataKey, currentData);
    onClose();
  }, [currentData, dataKey, onSave, onClose]);

  const renderImagePreview = (src: string) => (
    <div className="mt-2">
      <img 
        src={src} 
        alt="Preview" 
        className="max-w-48 max-h-48 object-cover rounded border"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
    </div>
  );

  const renderVideoPreview = (src: string) => (
    <div className="mt-2 relative">
      <video 
        src={src} 
        className="max-w-48 max-h-48 object-cover rounded border"
        controls={false}
        muted
        onError={(e) => {
          console.error('Video load error:', e);
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const video = document.querySelector('video') as HTMLVideoElement;
            if (video) {
              if (isVideoPlaying) {
                video.pause();
              } else {
                video.play();
              }
              setIsVideoPlaying(!isVideoPlaying);
            }
          }}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );

  const renderFileUpload = (value: string, index?: number) => {
    const isImage = typeof value === 'string' && (value.includes('.jpg') || value.includes('.png') || value.includes('.gif') || value.includes('.webp'));
    const isVideo = typeof value === 'string' && (value.includes('.mp4') || value.includes('.webm') || value.includes('.ogg'));

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFileUpload(e, index)}
            className="hidden"
            id={`file-upload-${index || 'single'}`}
          />
          <Label
            htmlFor={`file-upload-${index || 'single'}`}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded cursor-pointer hover:bg-secondary/80"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </Label>
          {value && (
            <span className="text-sm text-muted-foreground truncate">{value}</span>
          )}
        </div>
        
        {isImage && value && renderImagePreview(previewUrl || value)}
        {isVideo && value && renderVideoPreview(previewUrl || value)}
      </div>
    );
  };

  const renderArrayEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">Array Items ({currentData.length})</Label>
        <Button
          size="sm"
          onClick={addArrayItem}
          className="bg-primary text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>
      
      {currentData.map((item: any, index: number) => (
        <div key={index} className="flex items-start gap-2 p-3 border border-border rounded">
          <div className="flex-1">
            <Label className="text-sm text-muted-foreground">Item {index + 1}</Label>
            {typeof item === 'string' && (item.includes('.') && (item.includes('jpg') || item.includes('png') || item.includes('mp4'))) ? 
              renderFileUpload(item, index) :
              <Textarea
                value={item}
                onChange={(e) => handleArrayItemChange(index, e.target.value)}
                className="mt-1 bg-background border-input"
                rows={2}
              />
            }
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

  const renderObjectEditor = () => (
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
      
      {Object.entries(currentData).map(([key, value]: [string, any]) => (
        <div key={key} className="flex items-start gap-2 p-3 border border-border rounded">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground w-20">Key:</Label>
              <Input
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const { [key]: oldValue, ...rest } = currentData;
                  setCurrentData({ ...rest, [newKey]: oldValue });
                }}
                className="bg-background border-input"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Value:</Label>
              {typeof value === 'string' && (value.includes('.') && (value.includes('jpg') || value.includes('png') || value.includes('mp4'))) ? 
                renderFileUpload(value, Object.keys(currentData).indexOf(key)) :
                <Textarea
                  value={value}
                  onChange={(e) => handleObjectPropertyChange(key, e.target.value)}
                  className="mt-1 bg-background border-input"
                  rows={2}
                />
              }
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

  const renderStringEditor = () => {
    const isFile = typeof currentData === 'string' && (currentData.includes('.') && (currentData.includes('jpg') || currentData.includes('png') || currentData.includes('mp4')));
    
    return (
      <div className="space-y-4">
        <Label className="text-foreground">Value</Label>
        {isFile ? 
          renderFileUpload(currentData) :
          <Textarea
            value={currentData}
            onChange={(e) => setCurrentData(e.target.value)}
            className="bg-background border-input"
            rows={4}
          />
        }
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background border-border text-foreground max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Edit {dataKey} ({Array.isArray(currentData) ? 'Array' : typeof currentData === 'object' ? 'Object' : 'String'})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {Array.isArray(currentData) && renderArrayEditor()}
          {typeof currentData === 'object' && !Array.isArray(currentData) && renderObjectEditor()}
          {(typeof currentData === 'string' || typeof currentData === 'number') && renderStringEditor()}
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