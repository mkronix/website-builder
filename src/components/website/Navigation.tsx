
import { Button } from '@/components/ui/button';

interface NavigationProps {
  logo: string;
  links: Array<{ text: string; href: string }>;
}

export const Navigation: React.FC<NavigationProps> = ({ logo, links }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">
          {logo}
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {link.text}
            </a>
          ))}
        </div>

        <Button className="md:hidden">
          Menu
        </Button>
      </div>
    </nav>
  );
};
