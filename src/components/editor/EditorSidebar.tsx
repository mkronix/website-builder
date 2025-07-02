import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Layers, Palette, Settings } from 'lucide-react';
import { ComponentLibrary } from './ComponentLibrary';
import { PageManager } from './PageManager';
import { ThemeCustomizer } from './ThemeCustomizer';

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
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: (
        <div className="p-4">
          <p className="text-gray-400 text-sm">Settings panel coming soon...</p>
        </div>
      )
    }
  ] as const;

  return (
    <div className="w-[17rem] fixed h-full bg-[#1c1c1c] border-r border-gray-700 flex flex-col">
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
                <AccordionTrigger className="px-4 py-3 hover:bg-[#272725] text-white hover:no-underline">
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-[#1c1c1c] pb-0">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};