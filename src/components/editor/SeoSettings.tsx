
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEditor } from '@/contexts/EditorContext';
import { useState } from 'react';

export const SeoSettings = () => {
  const { state, updateSettings, currentProject } = useEditor();
  const [seoSettings, setSeoSettings] = useState({
    site_title: state.settings?.global_meta?.site_title || currentProject?.name || '',
    site_description: state.settings?.global_meta?.site_description || currentProject?.description || '',
    keywords: state.settings?.global_meta?.keywords || '',
    og_image: state.settings?.global_meta?.og_image || '',
    favicon: state.settings?.favicon || ''
  });

  const handleSeoUpdate = (key: string, value: string) => {
    setSeoSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSeoSettings = () => {
    updateSettings({
      global_meta: {
        site_title: seoSettings.site_title,
        site_description: seoSettings.site_description,
        keywords: seoSettings.keywords,
        og_image: seoSettings.og_image
      },
      favicon: seoSettings.favicon
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="bg-[#272725] border-gray-600">
        <CardHeader>
          <CardTitle className="text-white text-sm">SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="site_title" className="block text-xs font-medium text-white mb-2">
              Site Title
            </label>
            <Input
              id="site_title"
              value={seoSettings.site_title}
              onChange={(e) => handleSeoUpdate('site_title', e.target.value)}
              className="bg-[#1c1c1c] border-gray-600 text-white text-xs"
              placeholder="Enter site title"
            />
          </div>

          <div>
            <label htmlFor="site_description" className="block text-xs font-medium text-white mb-2">
              Site Description
            </label>
            <Textarea
              id="site_description"
              value={seoSettings.site_description}
              onChange={(e) => handleSeoUpdate('site_description', e.target.value)}
              className="bg-[#1c1c1c] border-gray-600 text-white text-xs"
              placeholder="Enter site description"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-xs font-medium text-white mb-2">
              Keywords
            </label>
            <Input
              id="keywords"
              value={seoSettings.keywords}
              onChange={(e) => handleSeoUpdate('keywords', e.target.value)}
              className="bg-[#1c1c1c] border-gray-600 text-white text-xs"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div>
            <label htmlFor="og_image" className="block text-xs font-medium text-white mb-2">
              Open Graph Image URL
            </label>
            <Input
              id="og_image"
              value={seoSettings.og_image}
              onChange={(e) => handleSeoUpdate('og_image', e.target.value)}
              className="bg-[#1c1c1c] border-gray-600 text-white text-xs"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="favicon" className="block text-xs font-medium text-white mb-2">
              Favicon URL
            </label>
            <Input
              id="favicon"
              value={seoSettings.favicon}
              onChange={(e) => handleSeoUpdate('favicon', e.target.value)}
              className="bg-[#1c1c1c] border-gray-600 text-white text-xs"
              placeholder="https://example.com/favicon.ico"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={saveSeoSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              size="sm"
            >
              Save SEO Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
