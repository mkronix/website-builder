
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InlineContentEditorProps {
  contentType: 'text' | 'url' | 'image' | 'video' | null;
  currentValue: string;
  onSave: (newValue: string) => void;
}

export const InlineContentEditor: React.FC<InlineContentEditorProps> = ({
  contentType,
  currentValue,
  onSave
}) => {
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleSave = () => {
    onSave(value);
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
                    className="max-w-full h-32 object-cover"
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
      
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          className="bg-black hover:bg-black/80 text-white"
          disabled={!value.trim()}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
