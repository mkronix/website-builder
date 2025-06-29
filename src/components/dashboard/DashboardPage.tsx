
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Palette, Plus, TrendingUp, Users, Calendar, CreditCard } from 'lucide-react';
import websiteData from '@/data/data.json';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { analytics, billing, system_settings } = websiteData;
  
  // Mock user credits - in real app this would come from user context
  const [userCredits] = useState(150);
  
  const handleCreateProject = () => {
    if (userCredits <= 0) {
      alert('Insufficient credits! Please purchase more credits to create a new project.');
      return;
    }
    navigate('/editor');
  };

  const statsCards = [
    {
      title: 'Total Projects',
      value: Object.keys(websiteData.projects).length,
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      title: 'Components Used',
      value: analytics.most_used_components.length,
      icon: Palette,
      color: 'text-green-500'
    },
    {
      title: 'Templates Available',
      value: Object.keys(websiteData.templates).length,
      icon: BarChart3,
      color: 'text-purple-500'
    },
    {
      title: 'Credits Remaining',
      value: userCredits,
      icon: CreditCard,
      color: userCredits > 0 ? 'text-yellow-500' : 'text-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <Button 
            onClick={handleCreateProject}
            className={`${userCredits <= 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={userCredits <= 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Credits Warning */}
        {userCredits <= 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-red-500 font-semibold">No Credits Remaining</h3>
                <p className="text-gray-300 text-sm">You need credits to create new projects. Purchase more credits to continue building.</p>
              </div>
              <Button 
                onClick={() => navigate('/settings')}
                className="bg-red-600 hover:bg-red-700 text-white ml-auto"
              >
                Buy Credits
              </Button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-[#272725] border-gray-600">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#272725] border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigate('/projects')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">View and manage your existing projects</p>
            </CardContent>
          </Card>

          <Card className="bg-[#272725] border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigate('/templates')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Start with a professional template</p>
            </CardContent>
          </Card>

          <Card className="bg-[#272725] border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigate('/settings')}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Manage your account and preferences</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#272725] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {websiteData.user_activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-[#1c1c1c] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{activity.action_type}</p>
                    <p className="text-gray-400 text-sm">{new Date(activity.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className="bg-blue-500 text-white">
                    {activity.action_type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
