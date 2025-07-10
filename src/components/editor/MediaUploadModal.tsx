
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaUrl: string) => void;
  mediaType: 'image' | 'video';
  currentValue?: string;
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mediaType,
  currentValue = ''
}) => {
  const [urlInput, setUrlInput] = useState(currentValue);
  const [previewUrl, setPreviewUrl] = useState(currentValue);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    setPreviewUrl(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUrlInput(url);
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onSave(previewUrl);
      onClose();
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1c1c1c] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            Upload {mediaType === 'image' ? 'Image' : 'Video'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'upload')}>
          <TabsList className="grid w-full grid-cols-2 bg-[#272725]">
            <TabsTrigger value="url" className="text-white">URL</TabsTrigger>
            <TabsTrigger value="upload" className="text-white">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="media-url" className="text-white">
                {mediaType === 'image' ? 'Image' : 'Video'} URL
              </Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="media-url"
                  type="url"
                  value={urlInput}
                  onChange={handleUrlChange}
                  placeholder={`https://example.com/${mediaType}.${mediaType === 'image' ? 'jpg' : 'mp4'}`}
                  className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="border-gray-600 text-white bg-[#272725]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label className="text-white">Upload from device</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-gray-600 text-white bg-[#272725] border-dashed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose {mediaType === 'image' ? 'Image' : 'Video'} File
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {previewUrl && (
          <div className="mt-4">
            <Label className="text-white">Preview:</Label>
            <div className="mt-2 border border-gray-600 rounded-lg overflow-hidden bg-black">
              {mediaType === 'image' ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-48 object-contain mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="max-w-full h-48 object-contain mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-white bg-[#272725] hover:bg-[#272725]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!previewUrl}
            className="bg-black hover:bg-black/30 text-white"
          >
            Save {mediaType === 'image' ? 'Image' : 'Video'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
