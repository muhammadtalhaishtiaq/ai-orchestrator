import LabPageTemplate from '@/components/lab-page-template';
import { GitBranch } from 'lucide-react';

export default function KNNPage() {
  return (
    <LabPageTemplate
      title="K-Nearest Neighbors"
      description="Instance-based classification with nearest neighbor voting"
      icon={<GitBranch className="w-6 h-6 text-white" />}
    />
  );
}
