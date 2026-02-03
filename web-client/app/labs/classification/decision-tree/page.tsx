import LabPageTemplate from '@/components/lab-page-template';
import { GitBranch } from 'lucide-react';

export default function DecisionTreeClassificationPage() {
  return (
    <LabPageTemplate
      title="Decision Tree Classification"
      description="Tree-based models for interpretable classification"
      icon={<GitBranch className="w-6 h-6 text-white" />}
    />
  );
}
