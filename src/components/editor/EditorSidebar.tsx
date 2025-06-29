import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { ComponentLibrary } from './ComponentLibrary';
import { PageManager } from './PageManager';
import { ThemeCustomizer } from './ThemeCustomizer';
import { Layers, FileText, Palette, Settings } from 'lucide-react';
type TabType = 'components' | 'pages' | 'theme' | 'settings';
export const EditorSidebar = () => {
  const [activeTab, setActiveTab] = useState<TabType>('components');
  const {
    state
  } = useEditor();
  const tabs = [{
    id: 'components',
    label: 'Components',
    icon: Layers
  }, {
    id: 'pages',
    label: 'Pages',
    icon: FileText
  }, {
    id: 'theme',
    label: 'Theme',
    icon: Palette
  }, {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }] as const;
  const renderTabContent = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentLibrary />;
      case 'pages':
        return <PageManager />;
      case 'theme':
        return <ThemeCustomizer />;
      case 'settings':
        return <div className="p-4">
            <p className="text-gray-400 text-sm">Settings panel coming soon...</p>
          </div>;
      default:
        return null;
    }
  };
  return <div className="w-80 bg-[#1c1c1c] border-r border-gray-700 flex flex-col">
      <div className="flex border-b flex-wrap ">
        {tabs.map(tab => {
        const Icon = tab.icon;
        return <Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab(tab.id)} className={`flex-1 rounded-none border-0 ${activeTab === tab.id ? 'bg-[#272725] text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#272725]'}`}>
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>;
      })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>;
};