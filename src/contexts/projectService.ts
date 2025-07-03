import { EditorState, Project, Template } from "./editorTypes";

// ===== SERVICE INTERFACES =====
interface ProjectService {
    getCurrentProject(): string | null;
    setCurrentProject(projectId: string): void;
    getProject(projectId: string): Project | null;
    saveProject(project: Project): void;
    createProjectFromState(state: EditorState, name: string, description?: string): Project;
    createProjectFromTemplate(template: Template, name: string): Project;
}

const ProjectService: ProjectService = {
    getCurrentProject: () => {
        return localStorage.getItem('currentProject');
    },

    setCurrentProject: (projectId: string) => {
        localStorage.setItem('currentProject', projectId);
    },

    getProject: (projectId: string) => {
        const projects = JSON.parse(localStorage.getItem('projects') || '{}');
        return projects[projectId] || null;
    },

    saveProject: (project: Project) => {
        const projects = JSON.parse(localStorage.getItem('projects') || '{}');
        projects[project.id] = project;
        localStorage.setItem('projects', JSON.stringify(projects));
    },

    createProjectFromState: (state: EditorState, name: string, description?: string) => {
        const now = new Date().toISOString();
        return {
            id: `proj_${Date.now()}`,
            name,
            description,
            created_at: now,
            updated_at: now,
            pages: state.pages,
            theme: state.theme,
            settings: state.settings,
            is_exported: false,
            export_count: 0
        };
    },

    createProjectFromTemplate: (template: Template, name: string) => {
        const now = new Date().toISOString();
        return {
            id: `proj_${Date.now()}`,
            name,
            description: `Project based on ${template.name} template`,
            template_id: template.id,
            created_at: now,
            updated_at: now,
            pages: template.pages.map(page => ({
                ...page,
                components: page.components.map(comp => ({
                    ...comp,
                    id: `comp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                    component_id: comp.component_id,
                    category: comp.category
                }))
            })),
            theme: template.theme,
            settings: {
                favicon: template.favicon,
                global_meta: template.global_meta,
                theme: template.theme,
                custom_css: template.custom_css,
                custom_scripts: template.custom_scripts
            },
            is_exported: false,
            export_count: 0
        };
    }
};

export default ProjectService;