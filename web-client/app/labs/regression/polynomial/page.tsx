import LabPageTemplate from '@/components/lab-page-template';
import { TrendingUp } from 'lucide-react';

export default function PolynomialPage() {
  return (
    <LabPageTemplate
      title="Polynomial Regression"
      description="Model non-linear relationships with polynomial features"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
    />
  );
}
