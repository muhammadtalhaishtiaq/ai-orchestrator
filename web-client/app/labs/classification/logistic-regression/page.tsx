import LabPageTemplate from '@/components/lab-page-template';
import { GitBranch } from 'lucide-react';

export default function LogisticRegressionPage() {
  return (
    <LabPageTemplate
      title="Logistic Regression"
      description="Binary and multiclass classification with logistic models"
      icon={<GitBranch className="w-6 h-6 text-white" />}
    />
  );
}
