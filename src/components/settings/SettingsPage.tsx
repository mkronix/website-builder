
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import websiteData from '@/data/data.json';
import { Activity, BarChart3, CreditCard, Settings, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export const SettingsPage = () => {
  const { system_settings, analytics } = websiteData;
  const [settings, setSettings] = useState({
    auto_save_enabled: true,
    dark_mode: true,
    responsive_preview: true,
    auto_save_interval: system_settings.auto_save_interval
  });


  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] via-[#1a1a1a] to-[#222222] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        </div>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-[#272725] overflow-x-auto">
            <TabsTrigger value="system" className="text-white data-[state=active]:text-[#1c1c1c] data-[state=active]:bg-white text-xs sm:text-sm transition-all duration-200">
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>

            <TabsTrigger value="analytics" className="text-white data-[state=active]:text-[#1c1c1c] data-[state=active]:bg-white text-xs sm:text-sm transition-all duration-200">
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-white data-[state=active]:text-[#1c1c1c] data-[state=active]:bg-white text-xs sm:text-sm transition-all duration-200">
              <CreditCard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="text-white data-[state=active]:text-[#1c1c1c] data-[state=active]:bg-white text-xs sm:text-sm transition-all duration-200">
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
                      className='bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]'
                      onCheckedChange={(checked) => updateSetting('dark_mode', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-[#1c1c1c] rounded-lg border border-gray-600">
                  <label htmlFor='supported_frameworks' className="text-white font-medium">Supported Frameworks</label>
                  <div className="flex flex-wrap gap-2">
                    {system_settings.supported_frameworks.map((framework) => (
                      <Badge key={framework} className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c] ">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
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
                    <Activity className="w-8 h-8 text-white" />
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
                    <TrendingUp className="w-8 h-8 text-white" />
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
                    <BarChart3 className="w-8 h-8 text-white" />
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
                    <Activity className="w-8 h-8 text-white" />
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
                      <Badge className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c] ">{mockBilling.current_plan}</Badge>
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
                        <Badge variant="secondary" className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c] ">
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
