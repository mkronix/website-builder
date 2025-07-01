
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'text' | 'url' | 'image' | 'video' | null;
  currentValue: string;
  onSave: (newValue: string) => void;
}

export const ContentEditModal: React.FC<ContentEditModalProps> = ({
  isOpen,
  onClose,
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
                className="bg-[#272725] border-gray-600 text-white"
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
                className="bg-[#272725] border-gray-600 text-white"
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
                className="bg-[#272725] border-gray-600 text-white"
              />
            </div>
            {value && (
              <div className="mt-4">
                <Label className="text-white">Preview:</Label>
                <img src={value} alt="Preview" className="mt-2 max-w-full h-32 object-cover rounded" />
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
                placeholder="https://youtube.com/watch?v=..."
                className="bg-[#272725] border-gray-600 text-white"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1c1c] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            Edit {contentType ? contentType.charAt(0).toUpperCase() + contentType.slice(1) : 'Content'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {renderContentEditor()}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-white hover:bg-[#272725]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
