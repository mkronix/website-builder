
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Bell, Settings, BarChart3, CreditCard, Shield } from 'lucide-react';
import websiteData from '@/data/data.json';

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
                  <label className="text-white">Auto Save</label>
                  <Switch 
                    checked={settings.auto_save_enabled}
                    onCheckedChange={(checked) => updateSetting('auto_save_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-white">Dark Mode</label>
                  <Switch 
                    checked={settings.dark_mode}
                    onCheckedChange={(checked) => updateSetting('dark_mode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-white">Responsive Preview</label>
                  <Switch 
                    checked={settings.responsive_preview}
                    onCheckedChange={(checked) => updateSetting('responsive_preview', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">Auto Save Interval</label>
                  <p className="text-gray-400">{settings.auto_save_interval} seconds</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#272725] border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Total Components</CardTitle>
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
                  <CardTitle className="text-white">Session Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{analytics.user_engagement.avg_session_length}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Current Plan</span>
                  <Badge className="bg-blue-500 text-white">{billing.current_plan}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Credits Remaining</span>
                  <span className="text-white font-bold">{billing.credits_remaining}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-white">Usage This Month</span>
                  <Progress value={(billing.usage_this_month / 100) * 100} className="bg-gray-600" />
                  <p className="text-gray-400 text-sm">{billing.usage_this_month}% of monthly limit</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Next Billing Date</span>
                  <span className="text-gray-300">{new Date(billing.next_billing_date).toLocaleDateString()}</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-[#272725] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-[#1c1c1c] rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{notification.message}</p>
                          <p className="text-gray-400 text-sm">{new Date(notification.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className={notification.is_read ? 'bg-gray-500' : 'bg-blue-500'}>
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
                  {component_usage_stats.map((stat) => (
                    <div key={stat.component_id} className="flex items-center justify-between p-3 bg-[#1c1c1c] rounded-lg">
                      <span className="text-white">{stat.component_name}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-300">{stat.usage_count} uses</span>
                        <div className="w-20 bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(stat.usage_count / Math.max(...component_usage_stats.map(s => s.usage_count))) * 100}%` }}
                          />
                        </div>
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
