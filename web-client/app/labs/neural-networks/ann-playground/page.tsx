import LabPageTemplate from '@/components/lab-page-template';
import { Brain } from 'lucide-react';

export default function ANNPlaygroundPage() {
  return (
    <LabPageTemplate
      title="ANN Playground"
      description="Interactive experimentation with artificial neural networks"
      icon={<Brain className="w-6 h-6 text-white" />}
    />
  );
}
