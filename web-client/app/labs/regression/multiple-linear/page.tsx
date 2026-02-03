import LabPageTemplate from '@/components/lab-page-template';
import { TrendingUp } from 'lucide-react';

export default function MultipleLinearPage() {
  return (
    <LabPageTemplate
      title="Multiple Linear Regression"
      description="Extend linear regression to multiple input features"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
    />
  );
}
