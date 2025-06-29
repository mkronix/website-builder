
import { EditorState, Page, Component } from '@/contexts/EditorContext';

export interface Project {
  id: string;
  name: string;
  description?: string;
  pages: Page[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
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
    return {
      id: `project-${Date.now()}`,
      name,
      description: `Project created from ${template.name} template`,
      pages: template.pages.map((page: any) => ({
        id: page.slug.replace('/', '') || 'home',
        name: page.name,
        slug: page.slug,
        components: []
      })),
      theme: {
        primaryColor: template.theme.primary_color,
        secondaryColor: template.theme.secondary_color,
        backgroundColor: template.theme.background_color,
        textColor: template.theme.text_color
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      template_id: template.id
    };
  }
}
