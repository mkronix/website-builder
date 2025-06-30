
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { EditorProvider } from '@/contexts/EditorContext';
import '@/components/editor/EditorStyles.css';

const Edtior = () => {
  return (
    <EditorProvider>
      <div className="min-h-screen bg-[#1c1c1c] flex flex-col">
        <EditorHeader />
        <div className="flex flex-1 overflow-hidden">
          <EditorSidebar />
          <EditorCanvas />
        </div>
      </div>
    </EditorProvider>
  );
};

export default Edtior;
