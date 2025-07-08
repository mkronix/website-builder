
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface ProjectSettings {
  global_meta?: {
    site_title?: string;
    site_description?: string;
    keywords?: string;
    og_image?: string;
  };
  favicon?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Component {
  id: string;
  type: string;
  category: string;
  default_props: Record<string, any>;
  react_code?: string;
  customizableProps?: Record<string, any>;
  variant?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    og_image?: string;
    favicon?: string;
  };
}

export interface Page {
  id: string;
  name: string;
  path: string;
  components: Component[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    og_image?: string;
    favicon?: string;
  };
}

export interface EditorState {
  theme: Theme;
  components: Component[];
  pages: Page[];
  currentPage: string | null;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  selectedComponent: string | null;
  settings: ProjectSettings;
}

export interface EditorContextType {
  state: EditorState;
  selectComponent: (componentId: string) => void;
  addComponent: (pageId: string, component: Component) => void;
  removeComponent: (pageId: string, componentId: string) => void;
  updateComponent: (pageId: string, componentId: string, updates: Partial<Component>) => void;
  addPage: (page: Omit<Page, 'id'>) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  updateTheme: (updates: Partial<Theme>) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  updateSettings: (updates: Partial<ProjectSettings>) => void;
  updatePageSeo: (pageId: string, seoData: Partial<Page['seo']>) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const defaultTheme: Theme = {
  primaryColor: '#007BFF',
  secondaryColor: '#6C757D',
  backgroundColor: '#FAFAFA',
  textColor: '#333333',
  fontFamily: 'Arial, sans-serif',
};

const useInitialState = () => {
  return useState<EditorState>({
    theme: defaultTheme,
    components: [],
    pages: [{
      id: uuidv4(),
      name: 'Home',
      path: '/',
      components: [],
      seo: {
        title: 'Home',
        description: 'Home page',
        keywords: 'home',
        og_image: '',
        favicon: ''
      }
    }],
    currentPage: null,
    previewMode: 'desktop',
    selectedComponent: null,
    settings: {}
  });
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useInitialState();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!state.currentPage && state.pages.length > 0) {
      setState(prev => ({ ...prev, currentPage: prev.pages[0].id }));
    }
  }, [state.pages, state.currentPage, setState]);

  const selectComponent = (componentId: string) => {
    setState(prev => ({ ...prev, selectedComponent: componentId }));
  };

  const addComponent = (pageId: string, component: Component) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, components: [...page.components, { ...component, id: uuidv4() }] }
          : page
      )
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
      selectedComponent: null
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
            )
          }
          : page
      )
    }));
  };

  const addPage = (page: Omit<Page, 'id'>) => {
    const newPage: Page = { ...page, id: uuidv4(), components: [] };
    setState(prev => ({ ...prev, pages: [...prev.pages, newPage] }));
  };

  const updatePage = (pageId: string, updates: Partial<Page>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId ? { ...page, ...updates } : page
      )
    }));
  };

  const deletePage = (pageId: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.filter(page => page.id !== pageId),
      currentPage: prev.pages.length > 1 ? prev.pages[0].id : null
    }));
  };

  const setCurrentPage = (pageId: string) => {
    setState(prev => ({ ...prev, currentPage: pageId }));
  };

  const updateTheme = (updates: Partial<Theme>) => {
    setState(prev => ({ ...prev, theme: { ...prev.theme, ...updates } }));
  };

  const setPreviewMode = (mode: 'desktop' | 'tablet' | 'mobile') => {
    setState(prev => ({ ...prev, previewMode: mode }));
  };

  const updateSettings = (updates: Partial<ProjectSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  };

  const updatePageSeo = (pageId: string, seoData: Partial<Page['seo']>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, seo: { ...page.seo, ...seoData } }
          : page
      )
    }));
  };

  const value: EditorContextType = {
    state,
    selectComponent,
    addComponent,
    removeComponent,
    updateComponent,
    addPage,
    updatePage,
    deletePage,
    setCurrentPage,
    updateTheme,
    setPreviewMode,
    updateSettings,
    updatePageSeo,
    currentProject,
    setCurrentProject,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
