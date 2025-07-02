import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Eye, Edit, Trash2, Download, Calendar, Settings } from 'lucide-react';
import websiteData from '@/data/data.json';

export const ProjectsPage = () => {
  const projectsArray = Object.values(websiteData.projects);
  const [projects, setProjects] = useState(projectsArray);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSeoDialog, setShowSeoDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    siteName: '',
    twitterHandle: '',
    ogImage: ''
  });

  const getStatusColor = (isExported: boolean) => {
    return isExported ? 'bg-green-500' : 'bg-gray-500';
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: `project-${Date.now()}`,
        user_id: 'user_001',
        name: newProjectName,
        template_used: 'blank',
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        is_exported: false,
        export_count: 0,
        last_export: '',
        settings: {
          favicon: '',
          global_meta: {
            title: newProjectName,
            description: '',
            keywords: []
          },
          theme: {
            primary_color: '#3b82f6',
            secondary_color: '#64748b',
            font_family: 'Inter'
          },
          custom_css: ''
        },
        pages: []
      };
      setProjects([...projects, newProject] as any);
      setNewProjectName('');
      setShowCreateDialog(false);
    }
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleSeoSave = () => {
    if (selectedProject) {
      const updatedProjects = projects.map(p => 
        p.id === selectedProject.id 
          ? {
                  ...p,
                  settings: {
                    ...p.settings,
                    seo: {
                      title: seoData.title,
                      description: seoData.description,
                      keywords: seoData.keywords.split(',').map(k => k.trim()).filter(k => k),
                      author: seoData.author,
                      siteName: seoData.siteName,
                      twitterHandle: seoData.twitterHandle,
                      ogImage: seoData.ogImage
                    },
                    custom_css: (p.settings as any)?.custom_css || ''
                  }
                }
          : p
      );
      setProjects(updatedProjects);
      setShowSeoDialog(false);
      setSeoData({
        title: '',
        description: '',
        keywords: '',
        author: '',
        siteName: '',
        twitterHandle: '',
        ogImage: ''
      });
    }
  };

  const openSeoDialog = (project: any) => {
    setSelectedProject(project);
    const seo = project.settings?.seo || {};
    setSeoData({
      title: seo.title || '',
      description: seo.description || '',
      keywords: seo.keywords?.join(', ') || '',
      author: seo.author || '',
      siteName: seo.siteName || '',
      twitterHandle: seo.twitterHandle || '',
      ogImage: seo.ogImage || ''
    });
    setShowSeoDialog(true);
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Projects</h1>
          <Button
            className="bg-[#272725] hover:bg-gray-600 text-white"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-[#272725] border-gray-600 hover:border-gray-500 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white">{project.name}</CardTitle>
                  <Badge className={`${getStatusColor(project.is_exported)} text-white`}>
                    {project.is_exported ? 'exported' : 'draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-gray-300 text-sm space-y-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Modified: {new Date(project.last_modified).toLocaleDateString()}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-white font-bold">{project.pages.length}</p>
                      <p className="text-gray-400 text-xs">Pages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">{project.export_count}</p>
                      <p className="text-gray-400 text-xs">Exports</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-black hover:bg-black/30 text-white">
                    <Eye className="w-4 h-4 mr-1" />
                    Open
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white hover:bg-[#1c1c1c]"
                    onClick={() => openSeoDialog(project)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-[#1c1c1c]">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Project Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Project</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <Input
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
              />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateDialog(false)}
                  className="text-gray-400 hover:text-white hover:bg-[#272725]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  className="bg-black hover:bg-black/30 text-white"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* SEO Settings Dialog */}
        <Dialog open={showSeoDialog} onOpenChange={setShowSeoDialog}>
          <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">SEO Settings - {selectedProject?.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-white">Site Title</Label>
                <Input
                  placeholder="Enter site title"
                  value={seoData.title}
                  onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                  className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Site Description</Label>
                <Textarea
                  placeholder="Enter site description"
                  value={seoData.description}
                  onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                  className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Keywords (comma-separated)</Label>
                <Input
                  placeholder="web design, business, professional"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                  className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Author</Label>
                <Input
                  placeholder="Your name or company"
                  value={seoData.author}
                  onChange={(e) => setSeoData({ ...seoData, author: e.target.value })}
                  className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Site Name</Label>
                <Input
                  placeholder="Your brand/site name"
                  value={seoData.siteName}
                  onChange={(e) => setSeoData({ ...seoData, siteName: e.target.value })}
                  className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Twitter Handle</Label>
                <Input
                  placeholder="@yourusername"
                  value={seoData.twitterHandle}
                  onChange={(e) => setSeoData({ ...seoData, twitterHandle: e.target.value })}
                  className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Open Graph Image URL</Label>
                <Input
                  placeholder="https://yoursite.com/og-image.jpg"
                  value={seoData.ogImage}
                  onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                  className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowSeoDialog(false)}
                  className="text-gray-400 hover:text-white hover:bg-[#272725]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSeoSave}
                  className="bg-black hover:bg-black/30 text-white"
                >
                  Save SEO Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
