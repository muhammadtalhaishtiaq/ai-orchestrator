import LabPageTemplate from '@/components/lab-page-template';
import { TrendingUp } from 'lucide-react';

export default function SimpleLinearPage() {
  return (
    <LabPageTemplate
      title="Simple Linear Regression"
      description="Learn the fundamentals of linear regression with single-variable prediction"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
    />
  );
}
