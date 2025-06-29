
import { useEditor, Component } from '@/contexts/EditorContext';
import { HeroSection } from '@/components/website/HeroSection';
import { Navigation } from '@/components/website/Navigation';
import { Footer } from '@/components/website/Footer';
import { cn } from '@/lib/utils';

interface ComponentRendererProps {
  component: Component;
  isSelected: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
}) => {
  const { selectComponent } = useEditor();

  const renderComponent = () => {
    switch (component.type) {
      case 'hero-1':
      case 'hero-2':
        return <HeroSection {...component.props} variant={component.type} />;
      case 'navbar-1':
        return <Navigation {...component.props} />;
      case 'footer-1':
        return <Footer {...component.props} />;
      default:
        return (
          <div className="p-8 bg-gray-50 text-center">
            <p className="text-gray-600">Unknown component: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
      onClick={() => selectComponent(component.id)}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
          Selected Component
        </div>
      )}
      
      <div className="group-hover:ring-1 group-hover:ring-gray-300 transition-all duration-200">
        {renderComponent()}
      </div>
    </div>
  );
};
