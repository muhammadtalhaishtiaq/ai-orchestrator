import LabPageTemplate from '@/components/lab-page-template';
import { GitBranch } from 'lucide-react';

export default function SVMPage() {
  return (
    <LabPageTemplate
      title="Support Vector Machine"
      description="Maximum margin classification with kernel tricks"
      icon={<GitBranch className="w-6 h-6 text-white" />}
    />
  );
}
