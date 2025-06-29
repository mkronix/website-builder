
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Eye, Download, Star, Search } from 'lucide-react';
import websiteData from '@/data/data.json';

export const TemplatesPage = () => {
  const [templates] = useState(websiteData.templates);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template =>
    template.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'business': return 'bg-blue-500';
      case 'portfolio': return 'bg-purple-500';
      case 'e-commerce': return 'bg-green-500';
      case 'blog': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const useTemplate = (template: any) => {
    console.log('Using template:', template.template_name);
    // Here you would integrate with your project creation system
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#272725] border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.template_id} className="bg-[#272725] border-gray-600 hover:border-gray-500 transition-colors group">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-gray-600 to-gray-800 rounded-t-lg flex items-center justify-center">
                  <span className="text-white text-4xl">{template.template_name.charAt(0)}</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => useTemplate(template)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white">{template.template_name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-gray-300 text-sm">{template.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{template.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge className={`${getCategoryColor(template.category)} text-white`}>
                    {template.category}
                  </Badge>
                  <span className="text-gray-400 text-sm">{template.downloads} downloads</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-white font-bold">{template.page_count}</p>
                    <p className="text-gray-400">Pages</p>
                  </div>
                  <div>
                    <p className="text-white font-bold">{template.component_count}</p>
                    <p className="text-gray-400">Components</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="bg-[#1c1c1c] border-gray-700 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedTemplate?.template_name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <div className="h-96 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-6xl">{selectedTemplate?.template_name?.charAt(0)}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Template Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Category:</span> <span className="text-white">{selectedTemplate?.category}</span></p>
                    <p><span className="text-gray-400">Rating:</span> <span className="text-white">{selectedTemplate?.rating}/5</span></p>
                    <p><span className="text-gray-400">Downloads:</span> <span className="text-white">{selectedTemplate?.downloads}</span></p>
                    <p><span className="text-gray-400">Pages:</span> <span className="text-white">{selectedTemplate?.page_count}</span></p>
                    <p><span className="text-gray-400">Components:</span> <span className="text-white">{selectedTemplate?.component_count}</span></p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Description</h3>
                  <p className="text-gray-300 text-sm">{selectedTemplate?.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => useTemplate(selectedTemplate)}
                    >
                      Use This Template
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white hover:bg-[#272725]"
                      onClick={() => setSelectedTemplate(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
