
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { MediaUploadModal } from './MediaUploadModal';

interface ContentEditorProps {
  contentType: 'text' | 'url' | 'image' | 'video' | null;
  currentValue: string;
  onSave: (newValue: string) => void;
  onClose: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  contentType,
  currentValue,
  onSave,
  onClose
}) => {
  const [value, setValue] = useState(currentValue);
  const [showMediaModal, setShowMediaModal] = useState(false);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const handleMediaSave = (mediaUrl: string) => {
    setValue(mediaUrl);
    setShowMediaModal(false);
  };

  const renderContentEditor = () => {
    switch (contentType) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content" className="text-white">Text Content</Label>
              <Textarea
                id="text-content"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter text content..."
                className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400 mt-2"
                rows={4}
              />
            </div>
          </div>
        );

      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url-content" className="text-white">URL</Label>
              <Input
                id="url-content"
                type="url"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://example.com"
                className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400 mt-2"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="url"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowMediaModal(true)}
                  className="w-full border-gray-600 text-white bg-[#272725]"
                >
                  Upload Image
                </Button>
              </div>
            </div>
            {value && (
              <div className="mt-4">
                <Label className="text-white">Preview:</Label>
                <div className="mt-2 border border-gray-600 rounded-lg overflow-hidden">
                  <img
                    src={value}
                    alt="Preview"
                    className="max-w-full h-56 object-contain mx-auto bg-black"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Video</Label>
              <div className="mt-2 space-y-3">
                <Input
                  type="url"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or direct video URL"
                  className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowMediaModal(true)}
                  className="w-full border-gray-600 text-white hover:bg-[#272725]"
                >
                  Upload Video
                </Button>
              </div>
            </div>
            {value && (
              <div className="mt-4">
                <Label className="text-white">Preview:</Label>
                <div className="mt-2 border border-gray-600 rounded-lg overflow-hidden bg-black">
                  <video
                    src={value}
                    controls
                    className="max-w-full h-32 object-contain mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                    }}
                  >
                    <track kind="captions" src="" label="English" />
                  </video>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-400">
            <p>Select an element to edit its content</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="space-y-4">
        {renderContentEditor()}
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
            className="bg-black hover:bg-black/30 text-white"
            disabled={!value.trim()}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <MediaUploadModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSave={handleMediaSave}
        mediaType={contentType === 'image' ? 'image' : 'video'}
        currentValue={value}
      />
    </>
  );
};

export default ContentEditor;
