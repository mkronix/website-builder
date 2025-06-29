import React, { createContext, useContext, useState, ReactNode } from 'react';
import websiteData from '@/data/data.json';

export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  content?: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  components: Component[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface EditorState {
  currentPage: string;
  pages: Page[];
  selectedComponent: string | null;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  previewMode: 'desktop' | 'tablet' | 'mobile';
  isDarkMode: boolean;
}

interface EditorContextType {
  state: EditorState;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  addComponent: (pageId: string, component: Component) => void;
  updateComponent: (pageId: string, componentId: string, updates: Partial<Component>) => void;
  removeComponent: (pageId: string, componentId: string) => void;
  selectComponent: (componentId: string | null) => void;
  updateTheme: (theme: Partial<EditorState['theme']>) => void;
  setPreviewMode: (mode: EditorState['previewMode']) => void;
  addPage: (page: Page) => void;
  removePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  toggleDarkMode: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EditorState>({
    currentPage: 'home',
    pages: websiteData.projects[0]?.pages || [
      {
        id: 'home',
        name: 'Home',
        slug: '/',
        components: [],
      },
      {
        id: 'about',
        name: 'About', 
        slug: '/about',
        components: [],
      },
      {
        id: 'services',
        name: 'Services',
        slug: '/services', 
        components: [],
      },
      {
        id: 'contact',
        name: 'Contact',
        slug: '/contact',
        components: [],
      },
    ],
    selectedComponent: null,
    theme: websiteData.system_settings.theme || {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6', 
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
    },
    previewMode: 'desktop',
    isDarkMode: websiteData.system_settings.dark_mode || false,
  });

  const updatePage = (pageId: string, updates: Partial<Page>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page => 
        page.id === pageId ? { ...page, ...updates } : page
      ),
    }));
  };

  const addComponent = (pageId: string, component: Component) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, components: [...page.components, component] }
          : page
      ),
    }));
  };

  const updateComponent = (pageId: string, componentId: string, updates: Partial<Component>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              components: page.components.map(comp =>
                comp.id === componentId ? { ...comp, ...updates } : comp
              ),
            }
          : page
      ),
    }));
  };

  const removeComponent = (pageId: string, componentId: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, components: page.components.filter(comp => comp.id !== componentId) }
          : page
      ),
      selectedComponent: prev.selectedComponent === componentId ? null : prev.selectedComponent,
    }));
  };

  const selectComponent = (componentId: string | null) => {
    setState(prev => ({ ...prev, selectedComponent: componentId }));
  };

  const updateTheme = (theme: Partial<EditorState['theme']>) => {
    setState(prev => ({
      ...prev,
      theme: { ...prev.theme, ...theme },
    }));
  };

  const setPreviewMode = (mode: EditorState['previewMode']) => {
    setState(prev => ({ ...prev, previewMode: mode }));
  };

  const addPage = (page: Page) => {
    setState(prev => ({ ...prev, pages: [...prev.pages, page] }));
  };

  const removePage = (pageId: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.filter(page => page.id !== pageId),
      currentPage: prev.currentPage === pageId ? prev.pages[0]?.id || 'home' : prev.currentPage,
    }));
  };

  const setCurrentPage = (pageId: string) => {
    setState(prev => ({ ...prev, currentPage: pageId }));
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  return (
    <EditorContext.Provider
      value={{
        state,
        updatePage,
        addComponent,
        updateComponent,
        removeComponent,
        selectComponent,
        updateTheme,
        setPreviewMode,
        addPage,
        removePage,
        setCurrentPage,
        toggleDarkMode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
