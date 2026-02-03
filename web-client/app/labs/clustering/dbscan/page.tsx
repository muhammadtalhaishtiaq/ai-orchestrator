import LabPageTemplate from '@/components/lab-page-template';
import { Users } from 'lucide-react';

export default function DBSCANPage() {
  return (
    <LabPageTemplate
      title="DBSCAN"
      description="Density-based spatial clustering for discovering arbitrary-shaped clusters"
      icon={<Users className="w-6 h-6 text-white" />}
    />
  );
}
