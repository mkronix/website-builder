
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Play, Pause } from 'lucide-react';

interface FileUploadSectionProps {
  value: string;
  onChange: (value: string) => void;
  index?: number;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  value,
  onChange,
  index
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const localPath = `/uploads/${file.name}`;
    onChange(localPath);
  };

  const isImage = typeof value === 'string' && (value.includes('.jpg') || value.includes('.png') || value.includes('.gif') || value.includes('.webp'));
  const isVideo = typeof value === 'string' && (value.includes('.mp4') || value.includes('.webm') || value.includes('.ogg'));

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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
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
