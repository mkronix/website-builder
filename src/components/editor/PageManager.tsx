import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEditor } from '@/contexts/EditorContext';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmationModal } from '../ui/delete-confirmation-modal';

export const PageManager = () => {
  const { state, addPage, deletePage, setCurrentPage } = useEditor();
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pageId: null });

  const handleAddPage = () => {
    if (newPageName.trim()) {
      const newPage = {
        name: newPageName,
        path: `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`,
        components: [],
      };
      addPage(newPage);
      setNewPageName('');
      setShowAddPage(false);
    }
  };

  const handleDeleteClick = (pageId) => {
    setDeleteModal({ isOpen: true, pageId });
  };

  const confirmDelete = () => {
    if (deleteModal.pageId) {
      deletePage(deleteModal.pageId);
      setDeleteModal({ isOpen: false, pageId: null });
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
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${state.currentPage === page.id
              ? 'bg-[#272725] border border-black'
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
                  handleDeleteClick(page.id);
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
              onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
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
                className="bg-black hover:bg-black/30 text-white"
              >
                Add Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, pageId: null })}
        onConfirm={confirmDelete}
        title="Delete this page?"
        description="This action cannot be undone. The page and all its components will be permanently removed."
      />
    </div>
  );
};