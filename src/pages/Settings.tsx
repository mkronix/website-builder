
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { EditorProvider } from '@/contexts/EditorContext';

const Settings = () => {
  return (
    <DashboardLayout>
      <EditorProvider>
        <SettingsPage />
      </EditorProvider>
    </DashboardLayout>
  );
};

export default Settings;
