
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, Download, CreditCard } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import websiteData from '@/data/data.json';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { updateProject } = useEditor();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock user credits - in real app this would come from user context
  const [userCredits] = useState(150);
  
  const templatesArray = Object.values(websiteData.templates);
  
  const filteredTemplates = templatesArray.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(templatesArray.map(t => t.category)))];

  const handleUseTemplate = (template: any) => {
    if (userCredits <= 0) {
      alert('Insufficient credits! Please purchase more credits to use templates.');
      return;
    }

    // Convert template to editor format
    const templatePages = template.pages.map((page: any) => ({
      id: page.slug.replace('/', '') || 'home',
      name: page.name,
      slug: page.slug,
      components: page.components.map((componentId: string) => {
        // Find component data from component library
        let componentData: any = null;
        Object.values(websiteData.component_library.categories).forEach(category => {
          const found = category.components.find((comp: any) => comp.id === componentId);
          if (found) {
            componentData = found;
          }
        });

        return {
          id: `component-${Date.now()}-${Math.random()}`,
          type: componentId,
          props: componentData?.default_props || {},
          reactCode: componentData?.react_code || '',
          customizableProps: componentData?.customizable_props || []
        };
      })
    }));

    // Update editor with template data
    updateProject({
      template: template.id,
      pages: templatePages,
      theme: {
        primaryColor: template.theme.primary_color,
        secondaryColor: template.theme.secondary_color,
        backgroundColor: template.theme.background_color,
        textColor: template.theme.text_color,
      },
      currentPage: templatePages[0]?.id || 'home'
    });

    // Navigate to editor
    navigate('/editor');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <p className="text-gray-400 mt-1">Start your project with a professional template</p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-yellow-500" />
          <span className="text-white font-medium">{userCredits} credits</span>
        </div>
      </div>

      {/* Credits Warning */}
      {userCredits <= 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-red-500 font-semibold">No Credits Remaining</h3>
              <p className="text-gray-300 text-sm">You need credits to use templates. Purchase more credits to continue.</p>
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

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#272725] border-gray-600 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-[#272725]'
              }
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="bg-[#272725] border-gray-600 hover:border-blue-500 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{template.name}</CardTitle>
                  <Badge className="bg-blue-500 text-white mt-2">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-[#1c1c1c] rounded-lg flex items-center justify-center">
                {template.preview_image ? (
                  <img 
                    src={template.preview_image} 
                    alt={template.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">Preview Image</span>
                )}
              </div>
              
              <p className="text-gray-300 text-sm">{template.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Pages:</span>
                  <span className="text-white">{template.pages.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Primary Color:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.theme.primary_color }}
                    />
                    <span className="text-white">{template.theme.primary_color}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="flex-1 text-blue-400 hover:text-blue-300"
                  onClick={() => window.open('#', '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className={`flex-1 ${userCredits <= 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  onClick={() => handleUseTemplate(template)}
                  disabled={userCredits <= 0}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No templates found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
