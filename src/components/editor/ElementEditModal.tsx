
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentEditModal } from './ContentEditModal';
import { StyleEditModal } from './StyleEditModal';

interface ElementEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'text' | 'url' | 'image' | 'video' | null;
  currentContent: string;
  currentStyles: Record<string, string>;
  onContentSave: (newContent: string) => void;
  onStyleSave: (newStyles: Record<string, string>) => void;
}

export const ElementEditModal: React.FC<ElementEditModalProps> = ({
  isOpen,
  onClose,
  contentType,
  currentContent,
  currentStyles,
  onContentSave,
  onStyleSave
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const handleContentSave = (newContent: string) => {
    onContentSave(newContent);
    onClose();
  };

  const handleStyleSave = (newStyles: Record<string, string>) => {
    onStyleSave(newStyles);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1c1c] border-gray-600 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Element</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#272725]">
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-black data-[state=active]:text-white">
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="text-white data-[state=active]:bg-black data-[state=active]:text-white">
              Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <ContentEditModal
              isOpen={true}
              onClose={() => {}}
              contentType={contentType}
              currentValue={currentContent}
              onSave={handleContentSave}
            />
          </TabsContent>

          <TabsContent value="style" className="mt-4">
            <StyleEditModal
              isOpen={true}
              onClose={() => {}}
              currentStyles={currentStyles}
              onSave={handleStyleSave}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
