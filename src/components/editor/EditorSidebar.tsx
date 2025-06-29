
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ComponentLibrary } from './ComponentLibrary';
import { ThemeCustomizer } from './ThemeCustomizer';
import { PageManager } from './PageManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Settings, Folder, Search } from 'lucide-react';

export const EditorSidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="components" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="components" className="flex items-center space-x-2">
            <Box className="h-4 w-4" />
            <span>Components</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center space-x-2">
            <Folder className="h-4 w-4" />
            <span>Pages</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Theme</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="components" className="p-4 mt-0">
            <ComponentLibrary searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="pages" className="p-4 mt-0">
            <PageManager />
          </TabsContent>
          
          <TabsContent value="theme" className="p-4 mt-0">
            <ThemeCustomizer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
