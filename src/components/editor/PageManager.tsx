
import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, FileText, Trash2 } from 'lucide-react';

export const PageManager = () => {
  const { state, addPage, removePage, setCurrentPage } = useEditor();
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const handleAddPage = () => {
    if (newPageName.trim()) {
      const newPage = {
        id: newPageName.toLowerCase().replace(/\s+/g, '-'),
        name: newPageName,
        slug: `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`,
        components: [],
      };
      addPage(newPage);
      setNewPageName('');
      setShowAddPage(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Pages</h3>
        <Button
          size="sm"
          onClick={() => setShowAddPage(true)}
          className="bg-[#272725] hover:bg-gray-600 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {state.pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              state.currentPage === page.id
                ? 'bg-[#272725] border border-blue-500'
                : 'bg-[#272725] hover:bg-gray-600 border border-transparent'
            }`}
            onClick={() => setCurrentPage(page.id)}
          >
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-white">{page.name}</span>
            </div>
            
            {state.pages.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  removePage(page.id);
                }}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={showAddPage} onOpenChange={setShowAddPage}>
        <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Page</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Page name"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPage()}
              className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
            />
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowAddPage(false)}
                className="text-gray-400 hover:text-white hover:bg-[#272725]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
