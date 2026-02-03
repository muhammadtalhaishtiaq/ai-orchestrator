import LabPageTemplate from '@/components/lab-page-template';
import { Users } from 'lucide-react';

export default function HierarchicalPage() {
  return (
    <LabPageTemplate
      title="Hierarchical Clustering"
      description="Build hierarchical dendrograms for nested cluster analysis"
      icon={<Users className="w-6 h-6 text-white" />}
    />
  );
}
