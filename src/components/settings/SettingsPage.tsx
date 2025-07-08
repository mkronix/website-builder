
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import websiteData from '@/data/data.json';
import { BarChart3, Bell, CreditCard, Settings, Shield, Globe, Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
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

  // Create mock data for missing properties to match expected structure
  const mockAnalytics = {
    page_views: 12540,
    unique_visitors: 8420,
    bounce_rate: '42.3',
    avg_session_duration: '3m 24s'
  };

  const mockBilling = {
    current_plan: 'Pro Plan',
    monthly_cost: 29,
    next_billing_date: '2025-02-15',
    payment_method: '**** 4242'
  };

  const mockNotificationSettings = [
    {
      type: 'Email Notifications',
      enabled: true,
      last_sent: '2 hours ago'
    },
    {
      type: 'Push Notifications',
      enabled: false,
      last_sent: 'Never'
    },
    {
      type: 'SMS Alerts',
      enabled: true,
      last_sent: '1 day ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] via-[#1a1a1a] to-[#222222] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"></div>
        </div>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-[#272725] overflow-x-auto">
            <TabsTrigger value="system" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 text-xs sm:text-sm transition-all duration-200">
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 text-xs sm:text-sm transition-all duration-200">
              <Globe className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 text-xs sm:text-sm transition-all duration-200">
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 text-xs sm:text-sm transition-all duration-200">
              <CreditCard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 text-xs sm:text-sm transition-all duration-200">
              <Bell className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 text-xs sm:text-sm transition-all duration-200">
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
                      <Badge key={framework} className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600">
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-medium">Site Title</label>
                    <Input
                      value={seoSettings.site_title}
                      onChange={(e) => handleSeoUpdate('site_title', e.target.value)}
                      className="bg-[#1c1c1c] border-gray-600 text-white"
                      placeholder="Enter site title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-medium">Favicon URL</label>
                    <Input
                      value={seoSettings.favicon}
                      onChange={(e) => handleSeoUpdate('favicon', e.target.value)}
                      className="bg-[#1c1c1c] border-gray-600 text-white"
                      placeholder="Enter favicon URL"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium">Site Description</label>
                  <Textarea
                    value={seoSettings.site_description}
                    onChange={(e) => handleSeoUpdate('site_description', e.target.value)}
                    className="bg-[#1c1c1c] border-gray-600 text-white"
                    placeholder="Enter site description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium">Keywords</label>
                  <Input
                    value={seoSettings.keywords}
                    onChange={(e) => handleSeoUpdate('keywords', e.target.value)}
                    className="bg-[#1c1c1c] border-gray-600 text-white"
                    placeholder="Enter keywords separated by commas"
                  />
                </div>
                <Button onClick={saveSeoSettings} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Save SEO Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Page Views</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.page_views.toLocaleString()}</p>
                    </div>
                    <Activity className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Unique Visitors</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.unique_visitors.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Bounce Rate</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.bounce_rate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg. Session</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.avg_session_duration}</p>
                    </div>
                    <Activity className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600">
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                      <span className="text-white font-medium">Current Plan</span>
                      <Badge className="bg-emerald-600 text-white">{mockBilling.current_plan}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                      <span className="text-white font-medium">Monthly Cost</span>
                      <span className="text-white font-bold">${mockBilling.monthly_cost}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                      <span className="text-white font-medium">Next Billing</span>
                      <span className="text-gray-300">{mockBilling.next_billing_date}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                      <span className="text-white font-medium">Payment Method</span>
                      <span className="text-gray-300">{mockBilling.payment_method}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  {mockNotificationSettings.map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                      <div className="flex items-center gap-3">
                        {setting.enabled ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <p className="text-white font-medium">{setting.type}</p>
                          <p className="text-gray-400 text-sm">Last: {setting.last_sent}</p>
                        </div>
                      </div>
                      <Switch checked={setting.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#272725] to-[#2a2a2a] border-gray-600 shadow-xl">
              <CardHeader className="border-b border-gray-600">
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Component Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.most_used_components.map((stat, index) => (
                    <div key={index} className="p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{stat.component_name}</h4>
                        <Badge variant="secondary" className="bg-emerald-600 text-white">
                          {stat.usage_count}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{stat.category}</p>
                      <div className="text-xs text-gray-500">
                        Component ID: {stat.component_id}
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
