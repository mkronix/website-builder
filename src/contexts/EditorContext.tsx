import { Project, ProjectService } from '@/services/projectService';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface Component {
  variant: string;
  id: string;
  category: string;
  default_props: Record<string, any>;
  content?: string;
  react_code?: string;
  customizableProps?: Record<string, any>;
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
  template?: string;
}

interface EditorContextType {
  state: EditorState;
  currentProject: Project | null;
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
  updateProject: (updates: Partial<EditorState>) => void;
  saveProject: (name?: string, description?: string) => void;
  loadProject: (projectId: string) => void;
  loadTemplate: (template: any) => void;
  createNewProject: (name: string, description?: string) => void;
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
    pages: [
      {
        id: 'home',
        name: 'Home',
        slug: '/',
        components: [],
      }
    ],
    selectedComponent: null,
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
    },
    previewMode: 'desktop',
    isDarkMode: false,
  });

  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Load current project on mount
  useEffect(() => {
    const currentProjectId = ProjectService.getCurrentProject();
    if (currentProjectId) {
      const project = ProjectService.getProject(currentProjectId);
      if (project) {
        setCurrentProject(project);
        setState(prev => ({
          ...prev,
          pages: project.pages,
          theme: project.theme,
          template: project.template_id
        }));
      }
    }
  }, []);

  // Auto-save project changes
  useEffect(() => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        pages: state.pages,
        theme: state.theme,
        updated_at: new Date().toISOString()
      };
      ProjectService.saveProject(updatedProject);
      setCurrentProject(updatedProject);
    }
  }, [state.pages, state.theme]);

  const createNewProject = useCallback((name: string, description?: string) => {
    const newProject = ProjectService.createProjectFromState(state, name, description);
    ProjectService.saveProject(newProject);
    ProjectService.setCurrentProject(newProject.id);
    setCurrentProject(newProject);
  }, [state]);

  const saveProject = useCallback((name?: string, description?: string) => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        name: name || currentProject.name,
        description: description || currentProject.description,
        pages: state.pages,
        theme: state.theme,
        updated_at: new Date().toISOString()
      };
      ProjectService.saveProject(updatedProject);
      setCurrentProject(updatedProject);
    } else if (name) {
      createNewProject(name, description);
    }
  }, [currentProject, state.pages, state.theme, createNewProject]);

  const loadProject = useCallback((projectId: string) => {
    const project = ProjectService.getProject(projectId);
    if (project) {
      setCurrentProject(project);
      ProjectService.setCurrentProject(project.id);
      setState(prev => ({
        ...prev,
        pages: project.pages,
        theme: project.theme,
        currentPage: project.pages[0]?.id || 'home',
        selectedComponent: null,
        template: project.template_id
      }));
    }
  }, []);

  const loadTemplate = useCallback((template: any) => {
    const templateProject = ProjectService.createProjectFromTemplate(template, `${template.name} Project`);
    ProjectService.saveProject(templateProject);
    ProjectService.setCurrentProject(templateProject.id);
    setCurrentProject(templateProject);

    setState(prev => ({
      ...prev,
      pages: templateProject.pages,
      theme: templateProject.theme,
      currentPage: templateProject.pages[0]?.id || 'home',
      selectedComponent: null,
      template: template.id
    }));
  }, []);

  const updateProject = useCallback((updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId ? { ...page, ...updates } : page
      ),
    }));
  }, []);

  const addComponent = useCallback((pageId: string, component: Component) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, components: [...page.components, component] }
          : page
      ),
    }));
  }, []);

  const updateComponent = useCallback((pageId: string, componentId: string, updates: Partial<Component>) => {
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
  }, []);

  const removeComponent = useCallback((pageId: string, componentId: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, components: page.components.filter(comp => comp.id !== componentId) }
          : page
      ),
      selectedComponent: prev.selectedComponent === componentId ? null : prev.selectedComponent,
    }));
  }, []);

  const selectComponent = useCallback((componentId: string | null) => {
    setState(prev => ({ ...prev, selectedComponent: componentId }));
  }, []);

  const updateTheme = useCallback((theme: Partial<EditorState['theme']>) => {
    setState(prev => ({
      ...prev,
      theme: { ...prev.theme, ...theme },
    }));
  }, []);

  const setPreviewMode = useCallback((mode: EditorState['previewMode']) => {
    setState(prev => ({ ...prev, previewMode: mode }));
  }, []);

  const addPage = useCallback((page: Page) => {
    setState(prev => ({ ...prev, pages: [...prev.pages, page] }));
  }, []);

  const removePage = useCallback((pageId: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.filter(page => page.id !== pageId),
      currentPage: prev.currentPage === pageId ? prev.pages[0]?.id || 'home' : prev.currentPage,
    }));
  }, []);

  const setCurrentPage = useCallback((pageId: string) => {
    setState(prev => ({ ...prev, currentPage: pageId }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const contextValue = useMemo(() => ({
    state,
    currentProject,
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
    updateProject,
    saveProject,
    loadProject,
    loadTemplate,
    createNewProject,
  }), [
    state,
    currentProject,
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
    updateProject,
    saveProject,
    loadProject,
    loadTemplate,
    createNewProject
  ]);

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};
