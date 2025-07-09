
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Layers, Palette, Settings, Globe } from 'lucide-react';
import { ComponentLibrary } from './ComponentLibrary';
import { PageManager } from './PageManager';
import { ThemeCustomizer } from './ThemeCustomizer';
import { SeoSettings } from './SeoSettings';

export const EditorSidebar = () => {
  const accordionItems = [
    {
      id: 'components',
      label: 'Components',
      icon: Layers,
      content: <ComponentLibrary />
    },
    {
      id: 'pages',
      label: 'Pages',
      icon: FileText,
      content: <PageManager />
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: Palette,
      content: <ThemeCustomizer />
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: Globe,
      content: <SeoSettings />
    }
  ] as const;

  return (
    <div className="w-full sm:w-[17rem] fixed h-full bg-[#1c1c1c] border-r border-gray-700 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          defaultValue="components"
          className="w-full"
        >
          {accordionItems.map((item) => {
            const Icon = item.icon;
            return (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-gray-700"
              >
                <AccordionTrigger className="px-3 sm:px-4 py-3 hover:bg-[#272725] text-white hover:no-underline transition-all duration-200">
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-[#1c1c1c] pb-0">
                  <div className="max-h-[60vh] overflow-y-auto">
                    {item.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};
