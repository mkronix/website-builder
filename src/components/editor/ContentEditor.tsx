
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleSave = () => {
    onSave(value);
    onClose();
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
              <Label htmlFor="image-url" className="text-white">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400 mt-2"
              />
            </div>
            {value && (
              <div className="mt-4">
                <Label className="text-white">Preview:</Label>
                <div className="mt-2 border border-gray-600 rounded-lg overflow-hidden">
                  <img
                    src={value}
                    alt="Preview"
                    className="max-w-full h-32 object-fill"
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
              <Label htmlFor="video-url" className="text-white">Video URL</Label>
              <Input
                id="video-url"
                type="url"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or direct video URL"
                className="bg-[#272725] border-gray-600 text-white placeholder:text-gray-400 mt-2"
              />
            </div>
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
    <div className="space-y-4">
      {renderContentEditor()}
      <div className="flex justify-end space-x-2 pt-4">
        <Button

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
  );
};

export default ContentEditor;