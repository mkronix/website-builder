
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEditor } from '@/contexts/EditorContext';
import templatesData from '@/data/templates.json';
import { useNavigate } from 'react-router-dom';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { loadTemplate } = useEditor();
  const templatesArray = Object.values(templatesData.templates);

  const createProjectFromTemplate = (template: any) => {
    loadTemplate(template);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose a Template</h1>
          <p className="text-white">Start with a pre-built template and customize it to your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesArray.map((template: any) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-[#1c1c1c]">
              <div className="aspect-video bg-[#272725] relative overflow-hidden">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-fill"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Template Preview
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black text-white">
                    {template.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-white text-sm mb-3">{template.description.length > 52 ? template.description.slice(0, 52) + '...' : template.description}</p>
                {template.tags && Array.isArray(template.tags) && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} className="text-xs bg-black text-white">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge className="text-xs bg-black text-white">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => createProjectFromTemplate(template)}
                  className="w-full bg-black text-white hover:bg-black/30"
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
            <h3 className="text-lg font-medium text-white mb-2">No templates available</h3>
            <p className="text-white mb-4">Templates will be added soon</p>
            <Button onClick={() => navigate('/editor')}>
              Start from Scratch
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
