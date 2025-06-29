
import { useState } from 'react';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { EditorProvider } from '@/contexts/EditorContext';

const Index = () => {
  return (
    <EditorProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EditorHeader />
        <div className="flex flex-1 overflow-hidden">
          <EditorSidebar />
          <EditorCanvas />
        </div>
      </div>
    </EditorProvider>
  );
};

export default Index;
