
import { useEditor } from '@/contexts/EditorContext';
import { Component } from '@/contexts/EditorContext';
import { Navigation } from '@/components/website/Navigation';
import { HeroSection } from '@/components/website/HeroSection';
import { Footer } from '@/components/website/Footer';

interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  component, 
  isSelected 
}) => {
  const { selectComponent } = useEditor();

  const renderComponent = () => {
    switch (component.type) {
      case 'nav-simple':
        return <Navigation 
          logo={component.props.logo || 'Your Logo'} 
          links={component.props.links || [{ text: 'Home', href: '/' }]} 
        />;
      case 'hero-simple':
        return <HeroSection 
          title={component.props.title || 'Welcome'} 
          subtitle={component.props.subtitle || 'Build something amazing'} 
          buttonText={component.props.buttonText || 'Get Started'} 
        />;
      case 'footer':
        return <Footer 
          companyName={component.props.companyName || 'Your Company'} 
          links={component.props.links || [{ text: 'Privacy', href: '/privacy' }]} 
        />;
      case 'text-block':
        return (
          <div className="p-8">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: component.props.content || 'Your content goes here...' }}
            />
          </div>
        );
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <p>Component type "{component.type}" not implemented yet</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative ${
        isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
      } hover:ring-1 hover:ring-gray-300 hover:ring-inset transition-all cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
    >
      {renderComponent()}
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Selected
        </div>
      )}
    </div>
  );
};
