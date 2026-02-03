import LabPageTemplate from '@/components/lab-page-template';
import { TrendingUp } from 'lucide-react';

export default function RandomForestRegressionPage() {
  return (
    <LabPageTemplate
      title="Random Forest Regression"
      description="Ensemble learning with multiple decision trees"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
    />
  );
}
