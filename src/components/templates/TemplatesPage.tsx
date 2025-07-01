
import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import componentsData from '@/data/components.json';
import templatesData from '@/data/templates.json';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { loadTemplate } = useEditor();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Get all components from the new structure
  const allComponents = Object.values(componentsData).flatMap((category: any) => 
    category.components || []
  );

  // Convert templates object to array
  const templatesArray = Object.values(templatesData.templates);

  const createProjectFromTemplate = (template: any) => {
    // Use loadTemplate from EditorContext
    loadTemplate(template);
    
    // Navigate to editor
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose a Template</h1>
          <p className="text-gray-600">Start with a pre-built template and customize it to your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesArray.map((template: any) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {template.preview_image ? (
                  <img 
                    src={template.preview_image} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Template Preview
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {template.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                
                {/* Only show tags if they exist */}
                {(template as any).tags && Array.isArray((template as any).tags) && (template as any).tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(template as any).tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(template as any).tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(template as any).tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button 
                  onClick={() => createProjectFromTemplate(template)}
                  className="w-full"
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {templatesArray.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates available</h3>
            <p className="text-gray-600 mb-4">Templates will be added soon</p>
            <Button onClick={() => navigate('/editor')}>
              Start from Scratch
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
