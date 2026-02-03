import LabPageTemplate from '@/components/lab-page-template';
import { Brain } from 'lucide-react';

export default function NeuronBasicsPage() {
  return (
    <LabPageTemplate
      title="Neuron Basics"
      description="Understanding the fundamental building blocks of neural networks"
      icon={<Brain className="w-6 h-6 text-white" />}
    />
  );
}
