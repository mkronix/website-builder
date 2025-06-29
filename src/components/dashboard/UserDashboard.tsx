
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Eye, Edit } from 'lucide-react';
import websiteData from '@/data/data.json';

export const UserDashboard = () => {
  const { user_activities, export_history } = websiteData;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created': return <Edit className="w-4 h-4 text-green-500" />;
      case 'component_added': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'project_exported': return <Download className="w-4 h-4 text-purple-500" />;
      default: return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Button className="bg-[#272725] hover:bg-gray-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Project
          </Button>
        </div>

        {/* Recent Activities */}
        <Card className="bg-[#272725] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user_activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-[#1c1c1c] rounded-lg">
                  {getActivityIcon(activity.action_type)}
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {activity.action_type === 'project_created' && `Created project: ${activity.metadata.project_name}`}
                      {activity.action_type === 'component_added' && `Added ${activity.metadata.component_type} component`}
                      {activity.action_type === 'project_exported' && `Exported project as ${activity.metadata.export_format}`}
                      {activity.action_type === 'page_created' && `Created new page: ${activity.metadata.page_name}`}
                      {activity.action_type === 'theme_updated' && `Updated theme property: ${activity.metadata.theme_property}`}
                    </p>
                    <p className="text-gray-400 text-sm">{new Date(activity.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#272725] text-white">
                    {activity.action_type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export History */}
        <Card className="bg-[#272725] border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Export History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600">
                  <TableHead className="text-gray-300">Project</TableHead>
                  <TableHead className="text-gray-300">Export Date</TableHead>
                  <TableHead className="text-gray-300">Format</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {export_history.exports.map((export_item) => (
                  <TableRow key={export_item.id} className="border-gray-600">
                    <TableCell className="text-white">{export_item.project_id}</TableCell>
                    <TableCell className="text-gray-300">{new Date(export_item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-gray-300">{export_item.export_type}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(export_item.status)} text-white`}>
                        {export_item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
