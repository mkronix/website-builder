import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import websiteData from '@/data/data.json';
import { Calendar, Clock, Download, Eye, Layers, Plus, Settings, Trash2, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmationModal } from '../ui/delete-confirmation-modal';

export const ProjectsPage = () => {
  const projectsArray = Object.values(websiteData.projects);
  const [projects, setProjects] = useState(projectsArray);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSeoDialog, setShowSeoDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null });
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    siteName: '',
    twitterHandle: '',
    ogImage: ''
  });

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

  const handleDeleteClick = (projectId: string) => {
    setDeleteModal({ isOpen: true, projectId });
  };

  const confirmDelete = () => {
    if (deleteModal.projectId) {
      setProjects(projects.filter(p => p.id !== deleteModal.projectId));
      setDeleteModal({ isOpen: false, projectId: null });
    }
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
    <div className="min-h-screen bg-[#1c1c1c] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Projects</h1>
          <Button
            className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-[#272725] rounded-xl border border-gray-700/50 hover:border-gray-600/80 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
            >
              {/* Gradient overlay for visual depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none" />

              {/* Header with floating status badge */}
              <div className="relative p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate group-hover:text-gray-100 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center mt-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span>{new Date(project.last_modified).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Status badge with modern design */}
                  <div className={`
            px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm
            ${project.is_exported
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }
          `}>
                    {project.is_exported ? 'Published' : 'Draft'}
                  </div>
                </div>

                {/* Stats grid with modern cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#1c1c1c]/60 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-lg">{project.pages.length}</p>
                        <p className="text-gray-400 text-xs">Pages</p>
                      </div>
                      <Layers className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>

                  <div className="bg-[#1c1c1c]/60 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-lg">{project.export_count}</p>
                        <p className="text-gray-400 text-xs">Exports</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Created date with icon */}
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action buttons with modern design */}
              <div className="px-6 pb-6">
                <div className="flex gap-2">
                  {/* Primary action - Open */}
                  <button className="flex-1 bg-white hover:bg-gray-100 text-[#1c1c1c] px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group/btn">
                    <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Open
                  </button>

                  {/* Secondary actions */}
                  <div className="flex gap-1">
                    <button
                      className="p-2.5 rounded-lg bg-[#1c1c1c]/60 hover:bg-[#1c1c1c] text-gray-400 hover:text-white transition-all duration-200 border border-gray-700/30 hover:border-gray-600"
                      onClick={() => openSeoDialog(project)}
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    <button className="p-2.5 rounded-lg bg-[#1c1c1c]/60 hover:bg-[#1c1c1c] text-gray-400 hover:text-white transition-all duration-200 border border-gray-700/30 hover:border-gray-600">
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/20 hover:border-red-500/30"
                      onClick={() => handleDeleteClick(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtle hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
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
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                className="bg-[#272725] border-gray-600 text-white placeholder-gray-400"
              />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateDialog(false)}
                  className="text-white bg-[#272725]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]"
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
                  className="text-white bg-[#272725]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSeoSave}
                  className="bg-white hover:bg-white hover:text-[#1c1c1c] text-[#1c1c1c]"
                >
                  Save SEO Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, projectId: null })}
          onConfirm={confirmDelete}
          title="Delete this project?"
          description="This action cannot be undone. The project and all its pages will be permanently removed."
        />
      </div>
    </div>
  );
};