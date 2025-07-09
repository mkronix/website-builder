
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEditor } from '@/contexts/EditorContext';
import { FileText, Image as ImageIcon, Plus, Tag, X } from 'lucide-react';
import { useState } from 'react';

interface SeoModalProps {
  pageId?: string;
  isGlobal?: boolean;
}

export const SeoTitleModal = ({ pageId, isGlobal = false }: SeoModalProps) => {
  const { state, updateSettings, updatePageSeo, currentProject } = useEditor();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(
    isGlobal
      ? (state.settings?.global_meta?.site_title || currentProject?.name || '')
      : (state.pages.find(p => p.id === pageId)?.seo?.title || '')
  );

  const handleSave = () => {
    if (isGlobal) {
      updateSettings({
        global_meta: {
          ...state.settings?.global_meta,
          site_title: title
        }
      });
    } else if (pageId) {
      updatePageSeo(pageId, { title });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start bg-[#1c1c1c] border-gray-600 text-white hover:bg-[#272725]">
          <FileText className="w-4 h-4 mr-2" />
          {isGlobal ? 'Global Title' : 'Page Title'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#272725] border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {isGlobal ? 'Global Site Title' : 'Page Title'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="bg-[#1c1c1c] border-gray-600 text-white"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-white bg-[#1c1c1c]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SeoDescriptionModal = ({ pageId, isGlobal = false }: SeoModalProps) => {
  const { state, updateSettings, updatePageSeo, currentProject } = useEditor();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(
    isGlobal
      ? (state.settings?.global_meta?.site_description || currentProject?.description || '')
      : (state.pages.find(p => p.id === pageId)?.seo?.description || '')
  );

  const handleSave = () => {
    if (isGlobal) {
      updateSettings({
        global_meta: {
          ...state.settings?.global_meta,
          site_description: description
        }
      });
    } else if (pageId) {
      updatePageSeo(pageId, { description });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start bg-[#1c1c1c] border-gray-600 text-white hover:bg-[#272725]">
          <FileText className="w-4 h-4 mr-2" />
          {isGlobal ? 'Global Description' : 'Page Description'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#272725] border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {isGlobal ? 'Global Site Description' : 'Page Description'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
            rows={4}
            className="bg-[#1c1c1c] border-gray-600 text-white"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-white bg-[#1c1c1c]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SeoKeywordsModal = ({ pageId, isGlobal = false }: SeoModalProps) => {
  const { state, updateSettings, updatePageSeo } = useEditor();
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(
    isGlobal
      ? (state.settings?.global_meta?.keywords?.split(', ') || [])
      : (state.pages.find(p => p.id === pageId)?.seo?.keywords?.split(', ') || [])
  );
  const [inputValue, setInputValue] = useState('');

  const addKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      setKeywords([...keywords, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = () => {
    const keywordsString = keywords.join(', ');
    if (isGlobal) {
      updateSettings({
        global_meta: {
          ...state.settings?.global_meta,
          keywords: keywordsString
        }
      });
    } else if (pageId) {
      updatePageSeo(pageId, { keywords: keywordsString });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start bg-[#1c1c1c] border-gray-600 text-white hover:bg-[#272725]">
          <Tag className="w-4 h-4 mr-2" />
          {isGlobal ? 'Global Keywords' : 'Page Keywords'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#272725] border-gray-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {isGlobal ? 'Global Keywords' : 'Page Keywords'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add keyword..."
              className="bg-[#1c1c1c] border-0 text-white flex-1"
            />
            <Button onClick={addKeyword} size="sm" className="bg-[#1c1c1c]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[50px] p-3 bg-[#1c1c1c] rounded-md border-0">
            {keywords.map((keyword) => (
              <Badge key={keyword} className="bg-[#272725] hover:bg-[#272725] text-white flex items-center gap-1 rounded-md">
                {keyword}
                <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:bg-[#272725]">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-white bg-[#1c1c1c]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]">
              Save Keywords
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SeoImageModal = ({ pageId, isGlobal = false, type = 'og_image' }: SeoModalProps & { type?: 'og_image' | 'favicon' }) => {
  const { state, updateSettings, updatePageSeo } = useEditor();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    isGlobal
      ? (type === 'favicon' ? state.settings?.favicon || '' : state.settings?.global_meta?.og_image || '')
      : (type === 'favicon' ? state.pages.find(p => p.id === pageId)?.seo?.favicon || '' : state.pages.find(p => p.id === pageId)?.seo?.og_image || '')
  );

  const handleSave = () => {
    if (isGlobal) {
      if (type === 'favicon') {
        updateSettings({ favicon: imageUrl });
      } else {
        updateSettings({
          global_meta: {
            ...state.settings?.global_meta,
            og_image: imageUrl
          }
        });
      }
    } else if (pageId) {
      updatePageSeo(pageId, { [type]: imageUrl });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start bg-[#1c1c1c] border-gray-600 text-white hover:bg-[#272725]">
          <ImageIcon className="w-4 h-4 mr-2" />
          {type === 'favicon' ? 'Favicon' : 'OG Image'} {isGlobal ? '(Global)' : '(Page)'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#272725] border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {type === 'favicon' ? 'Favicon' : 'Open Graph Image'} {isGlobal ? '(Global)' : '(Page)'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="bg-[#1c1c1c] border-gray-600 text-white"
          />
          {imageUrl && (
            <div className="p-4 bg-[#1c1c1c] rounded-md border border-gray-600">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full h-32 object-contain rounded border border-gray-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-white bg-[#1c1c1c]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
