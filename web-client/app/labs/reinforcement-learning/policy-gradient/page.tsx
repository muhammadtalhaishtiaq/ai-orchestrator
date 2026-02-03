import LabPageTemplate from '@/components/lab-page-template';
import { Play } from 'lucide-react';

export default function PolicyGradientPage() {
  return (
    <LabPageTemplate
      title="Policy Gradient"
      description="Direct policy optimization with gradient ascent methods"
      icon={<Play className="w-6 h-6 text-white" />}
    />
  );
}
