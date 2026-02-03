import LabPageTemplate from '@/components/lab-page-template';
import { TrendingUp } from 'lucide-react';

export default function SVRPage() {
  return (
    <LabPageTemplate
      title="Support Vector Regression"
      description="Apply support vector machines to regression problems"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
    />
  );
}
