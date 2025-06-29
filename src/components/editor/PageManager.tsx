
import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Settings, Trash2 } from 'lucide-react';

export const PageManager = () => {
  const { state, addPage, removePage, setCurrentPage, updatePage } = useEditor();
  const [newPageName, setNewPageName] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);

  const handleAddPage = () => {
    if (newPageName.trim()) {
      const slug = `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
      const newPage = {
        id: Date.now().toString(),
        name: newPageName,
        slug,
        components: [],
      };
      addPage(newPage);
      setNewPageName('');
      setShowAddPage(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-900">Pages</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddPage(!showAddPage)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showAddPage && (
        <div className="space-y-2 p-3 border border-gray-200 rounded-lg">
          <Input
            placeholder="Page name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPage()}
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleAddPage}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAddPage(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {state.pages.map((page) => (
          <div
            key={page.id}
            className={`p-3 border rounded-lg transition-colors cursor-pointer ${
              state.currentPage === page.id
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCurrentPage(page.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-gray-900">{page.name}</div>
                <div className="text-xs text-gray-600">{page.slug}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {page.components.length} components
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" className="p-1">
                  <Settings className="h-3 w-3" />
                </Button>
                {state.pages.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePage(page.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
