
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Download, Save } from 'lucide-react';

export const EditorHeader = () => {
  const { state, setPreviewMode } = useEditor();

  return (
    <header className="bg-[#272725] border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-white text-xl font-bold">Website Builder</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-[#1c1c1c] rounded-lg p-1">
          <Button
            variant={state.previewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
            className="bg-transparent hover:bg-[#272725] text-white"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={state.previewMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('tablet')}
            className="bg-transparent hover:bg-[#272725] text-white"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={state.previewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="bg-transparent hover:bg-[#272725] text-white"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Button className="bg-[#272725] hover:bg-gray-600 text-white border-gray-600">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </header>
  );
};
