import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import websiteData from '@/data/data.json';
import { BarChart3, Bell, CreditCard, Settings, Shield, Globe } from 'lucide-react';
import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';

export const SettingsPage = () => {
  const { system_settings, analytics, component_usage_stats, billing, notifications } = websiteData;
  const { state, updateSettings, currentProject } = useEditor();
  const [settings, setSettings] = useState({
    auto_save_enabled: true,
    dark_mode: true,
    responsive_preview: true,
    auto_save_interval: system_settings.auto_save_interval
  });
  
  const [seoSettings, setSeoSettings] = useState({
    site_title: state.settings?.global_meta?.site_title || currentProject?.name || '',
    site_description: state.settings?.global_meta?.site_description || currentProject?.description || '',
    keywords: state.settings?.global_meta?.keywords || '',
    og_image: state.settings?.global_meta?.og_image || '',
    favicon: state.settings?.favicon || ''
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] via-[#1a1a1a] to-[#222222] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"></div>
        </div>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-[#272725] overflow-x-auto">
            <TabsTrigger value="system" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 text-xs sm:text-sm transition-all duration-200">
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 text-xs sm:text-sm transition-all duration-200">
              <Globe className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 text-xs sm:text-sm transition-all duration-200">
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 text-xs sm:text-sm transition-all duration-200">
              <CreditCard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 text-xs sm:text-sm transition-all duration-200">
              <Bell className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 text-xs sm:text-sm transition-all duration-200">
              <Shield className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Usage</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600">
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                    <label htmlFor='auto_save_enabled' className="text-white font-medium">Auto Save</label>
                    <Switch
                      checked={settings.auto_save_enabled}
                      onCheckedChange={(checked) => updateSetting('auto_save_enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                    <label htmlFor='dark_mode' className="text-white font-medium">Dark Mode</label>
                    <Switch
                      checked={settings.dark_mode}
                      onCheckedChange={(checked) => updateSetting('dark_mode', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                  <label htmlFor='supported_frameworks' className="text-white font-medium">Supported Frameworks</label>
                  <div className="flex flex-wrap gap-2">
                    {system_settings.supported_frameworks.map((framework) => (
                      <Badge key={framework} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          
        </Tabs>
      </div>
    </div>
  );
};
