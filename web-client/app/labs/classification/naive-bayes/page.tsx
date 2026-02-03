import LabPageTemplate from '@/components/lab-page-template';
import { GitBranch } from 'lucide-react';

export default function NaiveBayesPage() {
  return (
    <LabPageTemplate
      title="Naive Bayes"
      description="Probabilistic classification based on Bayes theorem"
      icon={<GitBranch className="w-6 h-6 text-white" />}
    />
  );
}
