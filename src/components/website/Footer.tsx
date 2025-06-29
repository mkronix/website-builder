
interface FooterProps {
  companyName: string;
  links: Array<{ text: string; href: string }>;
}

export const Footer: React.FC<FooterProps> = ({ companyName, links }) => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">{companyName}</h3>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end space-x-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
