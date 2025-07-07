
import { EditorState, Page, Component } from '@/contexts/EditorContext';
import components from '@/data/components.json';
export interface Project {
  id: string;
  name: string;
  description?: string;
  pages: Page[];
  theme: {
    primary_color?: string;
    secondary_color?: string;
    background?: string;
    text_primary?: string;
  };
  created_at: string;
  updated_at: string;
  template_id?: string;
}

const PROJECTS_KEY = 'lovable_projects';
const CURRENT_PROJECT_KEY = 'lovable_current_project';

export class ProjectService {
  static getAllProjects(): Project[] {
    try {
      const projects = localStorage.getItem(PROJECTS_KEY);
      return projects ? JSON.parse(projects) : [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  static getProject(id: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  static saveProject(project: Project): void {
    try {
      const projects = this.getAllProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);

      const updatedProject = {
        ...project,
        updated_at: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        projects[existingIndex] = updatedProject;
      } else {
        projects.push(updatedProject);
      }

      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving project:', error);
    }
  }

  static deleteProject(id: string): void {
    try {
      const projects = this.getAllProjects();
      const filtered = projects.filter(p => p.id !== id);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  static getCurrentProject(): string | null {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  }

  static setCurrentProject(id: string): void {
    localStorage.setItem(CURRENT_PROJECT_KEY, id);
  }

  static createProjectFromState(state: EditorState, name: string, description?: string): Project {
    return {
      id: `project-${Date.now()}`,
      name,
      description,
      pages: state.pages,
      theme: state.theme,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      template_id: state.template
    };
  }

  static createProjectFromTemplate(template: any, name: string): Project {
    // Helper function to find component data by ID
    const findComponentById = (componentId: string) => {
      // Search through all categories in components.json
      for (const category of Object.values(components)) {
        if (category.components) {
          const found = category.components.find((c: any) => c.id === componentId);
          if (found) return found;
        }
      }
      return null;
    };

    // Transform template pages to project pages with full component data
    const projectPages = template.pages.map((page: any) => ({
      id: page.slug.replace('/', '') || 'home',
      name: page.name,
      slug: page.slug,
      components: page.components.map((componentId: string) => {
        const componentData = findComponentById(componentId);

        if (!componentData) {
          console.warn(`Component with ID "${componentId}" not found in components.json`);
          return {
            id: componentId,
            name: 'Unknown Component',
            type: 'unknown',
            props: {}
          };
        }

        return {
          id: componentData.id,
          name: componentData.name,
          variant: componentData.variant,
          category: componentData.category,
          type: componentData.category, // Using category as type
          props: componentData.default_props || {},
          react_code: componentData.react_code,
          dependencies: componentData.dependencies || []
        };
      })
    }));

    return {
      id: `project-${Date.now()}`,
      name,
      description: `Project created from ${template.name} template`,
      pages: projectPages,
      theme: {
        primary_color: template.theme.primary_color,
        secondary_color: template.theme.secondary_color,
        background: template.theme.background || template.theme.background_color,
        text_primary: template.theme.text_primary || template.theme.text_color
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      template_id: template.id
    };
  }
}
