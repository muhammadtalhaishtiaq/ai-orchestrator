import LabPageTemplate from '@/components/lab-page-template';
import { TrendingUp } from 'lucide-react';

export default function DecisionTreeRegressionPage() {
  return (
    <LabPageTemplate
      title="Decision Tree Regression"
      description="Build tree-based regression models for complex patterns"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
    />
  );
}
