import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Component, ComponentDefinition, EditorState, Page, Project, ProjectSettings, Template, Theme } from './editorTypes';
import { getDefaultProps, mergeComponentProps, mergeTheme } from './editorUtils';
import ProjectService from './projectService';

interface EditorContextType {
  state: EditorState;
  currentProject: Project | null;
  componentDefinitions: Record<string, ComponentDefinition>;
  templates: Record<string, Template>;
  loading: {
    project: boolean;
    templates: boolean;
    components: boolean;
  };
  error: string | null;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  addComponent: (pageId: string, component: Component) => void;
  updateComponent: (pageId: string, componentId: string, updates: Partial<Component>) => void;
  removeComponent: (pageId: string, componentId: string) => void;
  selectComponent: (componentId: string | null) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  setPreviewMode: (mode: EditorState['previewMode']) => void;
  addPage: (page: Page) => void;
  removePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  toggleDarkMode: () => void;
  updateProject: (updates: Partial<EditorState>) => void;
  updateSettings: (settings: Partial<ProjectSettings>) => void;
  saveProject: (name?: string, description?: string) => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  loadTemplate: (template: Template) => Promise<void>;
  createNewProject: (name: string, description?: string) => Promise<void>;
  getComponentDefinition: (componentId: string) => ComponentDefinition | null;
  clearError: () => void;
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
        meta: {
          title: 'Home',
          description: 'Welcome to our homepage'
        }
      }
    ],
    selectedComponent: null,
    theme: {
      primary_color: '#3B82F6',
      secondary_color: '#8B5CF6',
      background: '#FFFFFF',
      text_primary: '#1F2937',
      text_secondary: '#6B7280',
      font_family: 'Inter, sans-serif'
    },
    previewMode: 'desktop',
    isDarkMode: false,
    settings: {
      global_meta: {
        site_title: 'My Website',
        site_description: 'Welcome to my website'
      }
    }
  });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [componentDefinitions, setComponentDefinitions] = useState<Record<string, ComponentDefinition>>({});
  const [templates, setTemplates] = useState<Record<string, Template>>({});
  const [loading, setLoading] = useState({
    project: false,
    templates: false,
    components: false
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponentDefinitions = async () => {
      setLoading(prev => ({ ...prev, components: true }));
      try {
        // Replace with your actual API call
        const response = await fetch('/api/components');
        if (response.ok) {
          const data = await response.json();
          const definitions: Record<string, ComponentDefinition> = {};

          // Process the components.json structure
          Object.values(data).forEach((category: any) => {
            if (category.components) {
              category.components.forEach((comp: ComponentDefinition) => {
                definitions[comp.id] = comp;
              });
            }
          });

          setComponentDefinitions(definitions);
        }
      } catch (err) {
        console.error('Failed to load component definitions:', err);
        setError('Failed to load templates');
      } finally {
        setLoading(prev => ({ ...prev, templates: false }));
      }
    };

    loadComponentDefinitions();
  }, []);

  useEffect(() => {
    const loadCurrentProject = async () => {
      setLoading(prev => ({ ...prev, project: true }));
      try {
        const currentProjectId = ProjectService.getCurrentProject();
        if (currentProjectId) {
          const project = ProjectService.getProject(currentProjectId);
          if (project) {
            setCurrentProject(project);

            // Ensure all pages have proper structure
            const normalizedPages = project.pages.map(page => ({
              ...page,
              meta: page.meta || {
                title: page.name,
                description: `${page.name} page`
              },
              components: page.components.map(comp => ({
                ...comp,
                props: comp.props || comp.default_props || {},
                category: comp.category || 'unknown'
              }))
            }));

            // Normalize theme
            const normalizedTheme = mergeTheme(
              project.theme || project.settings?.theme || {},
              state.theme
            );

            setState(prev => ({
              ...prev,
              pages: normalizedPages,
              theme: normalizedTheme,
              currentPage: normalizedPages[0]?.id || 'home',
              template: project.template_id || project.template_used,
              settings: {
                favicon: project.favicon || project.settings?.favicon,
                global_meta: project.global_meta || project.settings?.global_meta || {
                  site_title: project.name,
                  site_description: project.description || `${project.name} website`
                },
                theme: normalizedTheme,
                custom_css: project.custom_css || project.settings?.custom_css,
                custom_scripts: project.custom_scripts || project.settings?.custom_scripts
              }
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load current project:', err);
        setError('Failed to load current project');
      } finally {
        setLoading(prev => ({ ...prev, project: false }));
      }
    };

    loadCurrentProject();
  }, []);

  useEffect(() => {
    if (currentProject && !loading.project) {
      const saveTimeout = setTimeout(() => {
        try {
          const updatedProject: Project = {
            ...currentProject,
            pages: state.pages,
            theme: state.theme,
            settings: state.settings,
            updated_at: new Date().toISOString()
          };
          ProjectService.saveProject(updatedProject);
          setCurrentProject(updatedProject);
        } catch (err) {
          console.error('Failed to auto-save project:', err);
        }
      }, 1500); // Debounce saves

      return () => clearTimeout(saveTimeout);
    }
  }, [state.pages, state.theme, state.settings, currentProject, loading.project]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getComponentDefinition = useCallback((componentId: string): ComponentDefinition | null => {
    return componentDefinitions[componentId] || null;
  }, [componentDefinitions]);

  const createNewProject = useCallback(async (name: string, description?: string) => {
    setLoading(prev => ({ ...prev, project: true }));
    setError(null);

    try {
      const newProject = ProjectService.createProjectFromState(state, name, description);
      ProjectService.saveProject(newProject);
      ProjectService.setCurrentProject(newProject.id);
      setCurrentProject(newProject);
    } catch (err) {
      console.error('Failed to create new project:', err);
      setError('Failed to create new project');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, project: false }));
    }
  }, [state]);

  const saveProject = useCallback(async (name?: string, description?: string) => {
    setLoading(prev => ({ ...prev, project: true }));
    setError(null);

    try {
      if (currentProject) {
        const updatedProject: Project = {
          ...currentProject,
          name: name || currentProject.name,
          description: description || currentProject.description,
          pages: state.pages,
          theme: state.theme,
          settings: state.settings,
          updated_at: new Date().toISOString()
        };
        ProjectService.saveProject(updatedProject);
        setCurrentProject(updatedProject);
      } else if (name) {
        await createNewProject(name, description);
      }
    } catch (err) {
      console.error('Failed to save project:', err);
      setError('Failed to save project');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, project: false }));
    }
  }, [currentProject, state, createNewProject]);

  const loadProject = useCallback(async (projectId: string) => {
    setLoading(prev => ({ ...prev, project: true }));
    setError(null);

    try {
      const project = ProjectService.getProject(projectId);
      if (project) {
        setCurrentProject(project);
        ProjectService.setCurrentProject(project.id);

        // Normalize and merge component props with defaults
        const normalizedPages = project.pages.map(page => ({
          ...page,
          meta: page.meta || {
            title: page.name,
            description: `${page.name} page`
          },
          components: page.components.map(comp => {
            const defaultProps = getDefaultProps(comp.component_id || comp.id, componentDefinitions);
            return {
              ...comp,
              props: mergeComponentProps(comp.props || {}, defaultProps),
              category: comp.category || 'unknown'
            };
          })
        }));

        const normalizedTheme = mergeTheme(
          project.theme || project.settings?.theme || {},
          state.theme
        );

        setState(prev => ({
          ...prev,
          pages: normalizedPages,
          theme: normalizedTheme,
          currentPage: normalizedPages[0]?.id || 'home',
          selectedComponent: null,
          template: project.template_id || project.template_used,
          settings: {
            favicon: project.favicon || project.settings?.favicon,
            global_meta: project.global_meta || project.settings?.global_meta || {
              site_title: project.name,
              site_description: project.description || `${project.name} website`
            },
            theme: normalizedTheme,
            custom_css: project.custom_css || project.settings?.custom_css,
            custom_scripts: project.custom_scripts || project.settings?.custom_scripts
          }
        }));
      } else {
        throw new Error('Project not found');
      }
    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Failed to load project');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, project: false }));
    }
  }, [componentDefinitions, state.theme]);

  const loadTemplate = useCallback(async (template: Template) => {
    setLoading(prev => ({ ...prev, project: true }));
    setError(null);

    try {
      const templateProject = ProjectService.createProjectFromTemplate(template, `${template.name} Project`);
      ProjectService.saveProject(templateProject);
      ProjectService.setCurrentProject(templateProject.id);
      setCurrentProject(templateProject);

      // Normalize template pages and merge props with component definitions
      const normalizedPages = template.pages.map(page => ({
        ...page,
        meta: page.meta || {
          title: page.name,
          description: `${page.name} page`
        },
        components: page.components.map(comp => {
          const defaultProps = getDefaultProps(comp.component_id, componentDefinitions);
          return {
            id: comp.id,
            component_id: comp.component_id,
            category: componentDefinitions[comp.component_id]?.category || 'unknown',
            order: comp.order,
            props: mergeComponentProps(comp.props || {}, defaultProps)
          };
        })
      }));

      const normalizedTheme = mergeTheme(template.theme, state.theme);

      setState(prev => ({
        ...prev,
        pages: normalizedPages,
        theme: normalizedTheme,
        currentPage: normalizedPages[0]?.id || 'home',
        selectedComponent: null,
        template: template.id,
        settings: {
          favicon: template.favicon,
          global_meta: template.global_meta || {
            site_title: template.name,
            site_description: template.description
          },
          theme: normalizedTheme,
          custom_css: template.custom_css,
          custom_scripts: template.custom_scripts
        }
      }));
    } catch (err) {
      console.error('Failed to load template:', err);
      setError('Failed to load template');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, project: false }));
    }
  }, [componentDefinitions, state.theme]);

  const updateProject = useCallback((updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((settings: Partial<ProjectSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  }, []);

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId ? {
          ...page,
          ...updates,
          meta: { ...page.meta, ...updates.meta }
        } : page
      ),
    }));
  }, []);

  const addComponent = useCallback((pageId: string, component: Component) => {
    setState(prev => {
      const componentWithDefaults = {
        ...component,
        id: component.id || `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        props: component.props || getDefaultProps(component.component_id || component.id, componentDefinitions)
      };

      return {
        ...prev,
        pages: prev.pages.map(page =>
          page.id === pageId
            ? { ...page, components: [...page.components, componentWithDefaults] }
            : page
        ),
      };
    });
  }, [componentDefinitions]);

  const updateComponent = useCallback((pageId: string, componentId: string, updates: Partial<Component>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
            ...page,
            components: page.components.map(comp =>
              comp.id === componentId ? {
                ...comp,
                ...updates,
                props: updates.props ? { ...comp.props, ...updates.props } : comp.props
              } : comp
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

  const updateTheme = useCallback((theme: Partial<Theme>) => {
    setState(prev => ({
      ...prev,
      theme: { ...prev.theme, ...theme },
      settings: {
        ...prev.settings,
        theme: { ...prev.settings?.theme, ...theme }
      }
    }));
  }, []);

  const setPreviewMode = useCallback((mode: EditorState['previewMode']) => {
    setState(prev => ({ ...prev, previewMode: mode }));
  }, []);

  const addPage = useCallback((page: Page) => {
    const pageWithDefaults = {
      ...page,
      meta: page.meta || {
        title: page.name,
        description: `${page.name} page`
      },
      components: page.components || []
    };

    setState(prev => ({ ...prev, pages: [...prev.pages, pageWithDefaults] }));
  }, []);

  const removePage = useCallback((pageId: string) => {
    setState(prev => {
      const remainingPages = prev.pages.filter(page => page.id !== pageId);
      return {
        ...prev,
        pages: remainingPages,
        currentPage: prev.currentPage === pageId ? remainingPages[0]?.id || 'home' : prev.currentPage,
      };
    });
  }, []);

  const setCurrentPage = useCallback((pageId: string) => {
    setState(prev => ({ ...prev, currentPage: pageId, selectedComponent: null }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const contextValue = useMemo(() => ({
    state,
    currentProject,
    componentDefinitions,
    templates,
    loading,
    error,
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
    updateSettings,
    saveProject,
    loadProject,
    loadTemplate,
    createNewProject,
    getComponentDefinition,
    clearError,
  }), [
    state,
    currentProject,
    componentDefinitions,
    templates,
    loading,
    error,
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
    updateSettings,
    saveProject,
    loadProject,
    loadTemplate,
    createNewProject,
    getComponentDefinition,
    clearError,
  ]);

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};