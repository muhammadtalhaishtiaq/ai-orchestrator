import LabPageTemplate from '@/components/lab-page-template';
import { GitBranch } from 'lucide-react';

export default function RandomForestClassificationPage() {
  return (
    <LabPageTemplate
      title="Random Forest Classification"
      description="Ensemble classification with bagging and feature randomness"
      icon={<GitBranch className="w-6 h-6 text-white" />}
    />
  );
}
