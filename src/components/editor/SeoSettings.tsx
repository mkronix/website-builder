
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeoTitleModal, SeoDescriptionModal, SeoKeywordsModal, SeoImageModal } from './SeoModals';
import { useEditor } from '@/contexts/EditorContext';
import { Globe, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SeoSettings = () => {
  const { state } = useEditor();
  const currentPage = state.pages.find(page => page.id === state.currentPage);

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#1c1c1c] border border-gray-600">
          <TabsTrigger value="global" className="data-[state=active]:bg-[#272725] data-[state=active]:text-white text-gray-400">
            <Globe className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Global SEO</span>
            <span className="sm:hidden">Global</span>
          </TabsTrigger>
          <TabsTrigger value="page" className="data-[state=active]:bg-[#272725] data-[state=active]:text-white text-gray-400">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Page SEO</span>
            <span className="sm:hidden">Page</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-4 mt-4">
          <Card className="bg-[#272725] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Global SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SeoTitleModal isGlobal />
              <SeoDescriptionModal isGlobal />
              <SeoKeywordsModal isGlobal />
              <SeoImageModal isGlobal type="og_image" />
              <SeoImageModal isGlobal type="favicon" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page" className="space-y-4 mt-4">
          <Card className="bg-[#272725] border-gray-600">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Page SEO: {currentPage?.name || 'Current Page'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentPage ? (
                <>
                  <SeoTitleModal pageId={currentPage.id} />
                  <SeoDescriptionModal pageId={currentPage.id} />
                  <SeoKeywordsModal pageId={currentPage.id} />
                  <SeoImageModal pageId={currentPage.id} type="og_image" />
                  <SeoImageModal pageId={currentPage.id} type="favicon" />
                </>
              ) : (
                <p className="text-gray-400 text-sm">No page selected</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
