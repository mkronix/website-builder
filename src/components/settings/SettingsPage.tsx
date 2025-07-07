
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
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-[#272725] overflow-x-auto">
            <TabsTrigger value="system" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c] text-xs sm:text-sm">
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c] text-xs sm:text-sm">
              <Globe className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c] text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c] text-xs sm:text-sm">
              <CreditCard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c] text-xs sm:text-sm">
              <Bell className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c] text-xs sm:text-sm">
              <Shield className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Usage</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor='auto_save_enabled' className="text-white">Auto Save</label>
                  <Switch
                    checked={settings.auto_save_enabled}
                    onCheckedChange={(checked) => updateSetting('auto_save_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor='dark_mode' className="text-white">Dark Mode</label>
                  <Switch
                    checked={settings.dark_mode}
                    onCheckedChange={(checked) => updateSetting('dark_mode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor='responsive_preview' className="text-white">Responsive Preview</label>
                  <Switch
                    checked={settings.responsive_preview}
                    onCheckedChange={(checked) => updateSetting('responsive_preview', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="auto_save_interval" className="text-white">Auto Save Interval</label>
                  <p className="text-gray-400">{settings.auto_save_interval} seconds</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor='session_timeout' className="text-white">Session Timeout</label>
                  <p className="text-gray-400">{system_settings.session_timeout} minutes</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor='supported_frameworks' className="text-white">Supported Frameworks</label>
                  <div className="flex flex-wrap gap-2">
                    {system_settings.supported_frameworks.map((framework) => (
                      <Badge key={framework} className="bg-black text-white">{framework}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="site_title" className="block text-sm font-medium text-white mb-2">
                      Site Title
                    </label>
                    <Input
                      id="site_title"
                      value={seoSettings.site_title}
                      onChange={(e) => handleSeoUpdate('site_title', e.target.value)}
                      className="bg-[#1c1c1c] border-gray-600 text-white"
                      placeholder="Enter site title"
                    />
                  </div>

                  <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-white mb-2">
                      Keywords
                    </label>
                    <Input
                      id="keywords"
                      value={seoSettings.keywords}
                      onChange={(e) => handleSeoUpdate('keywords', e.target.value)}
                      className="bg-[#1c1c1c] border-gray-600 text-white"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="site_description" className="block text-sm font-medium text-white mb-2">
                    Site Description
                  </label>
                  <Textarea
                    id="site_description"
                    value={seoSettings.site_description}
                    onChange={(e) => handleSeoUpdate('site_description', e.target.value)}
                    className="bg-[#1c1c1c] border-gray-600 text-white"
                    placeholder="Enter site description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="og_image" className="block text-sm font-medium text-white mb-2">
                      Open Graph Image URL
                    </label>
                    <Input
                      id="og_image"
                      value={seoSettings.og_image}
                      onChange={(e) => handleSeoUpdate('og_image', e.target.value)}
                      className="bg-[#1c1c1c] border-gray-600 text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label htmlFor="favicon" className="block text-sm font-medium text-white mb-2">
                      Favicon URL
                    </label>
                    <Input
                      id="favicon"
                      value={seoSettings.favicon}
                      onChange={(e) => handleSeoUpdate('favicon', e.target.value)}
                      className="bg-[#1c1c1c] border-gray-600 text-white"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={saveSeoSettings}
                    className="bg-black hover:bg-black/30 text-white"
                  >
                    Save SEO Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#272725] border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{analytics.most_used_components.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#272725] border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{analytics.popular_templates.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#272725] border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Avg Session</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{analytics.user_engagement.average_session_duration}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Credit Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {billing.credit_packages.map((pkg) => (
                    <div key={pkg.id} className="p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                      <h3 className="text-white font-medium">{pkg.name}</h3>
                      <p className="text-gray-400 text-sm">{pkg.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white">{pkg.credits} credits</span>
                        <span className="text-black">${pkg.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billing.payment_history.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-[#1c1c1c] rounded-lg">
                      <div>
                        <p className="text-white">${payment.amount}</p>
                        <p className="text-gray-400 text-sm">{new Date(payment.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge className={payment.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">System Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.system_notifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-[#1c1c1c] rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{notification.title}</p>
                          <p className="text-gray-300">{notification.message}</p>
                          <p className="text-gray-400 text-sm">{new Date(notification.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className={notification.is_read ? 'bg-gray-500' : 'bg-black'}>
                          {notification.is_read ? 'Read' : 'Unread'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Component Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {component_usage_stats.daily_usage.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#1c1c1c] rounded-lg">
                      <div>
                        <span className="text-white">{stat.date}</span>
                        <p className="text-gray-400 text-sm">Most used: {stat.most_used_component}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-black">{stat.component_additions} additions</span>
                        <p className="text-gray-400 text-sm">{stat.active_users} users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
