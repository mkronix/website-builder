
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TemplatesPage } from '@/components/templates/TemplatesPage';
import { EditorProvider } from '@/contexts/EditorContext';

const Templates = () => {
  return (
    <DashboardLayout>
      <EditorProvider>
        <TemplatesPage />
      </EditorProvider>
    </DashboardLayout>
  );
};

export default Templates;
