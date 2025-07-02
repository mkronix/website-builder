
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import websiteData from '@/data/data.json';
import { BarChart3, Bell, CreditCard, Settings, Shield } from 'lucide-react';
import { useState } from 'react';

export const SettingsPage = () => {
  const { system_settings, analytics, component_usage_stats, billing, notifications } = websiteData;
  const [settings, setSettings] = useState({
    auto_save_enabled: true,
    dark_mode: true,
    responsive_preview: true,
    auto_save_interval: system_settings.auto_save_interval
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#272725]">
            <TabsTrigger value="system" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c]">
              <Settings className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c]">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c]">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="components" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#1c1c1c]">
              <Shield className="w-4 h-4 mr-2" />
              Usage
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
