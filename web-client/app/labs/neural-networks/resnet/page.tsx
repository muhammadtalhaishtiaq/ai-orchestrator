import LabPageTemplate from '@/components/lab-page-template';
import { Brain } from 'lucide-react';

export default function ResNetPage() {
  return (
    <LabPageTemplate
      title="ResNet"
      description="Residual Neural Networks with skip connections for deep architectures"
      icon={<Brain className="w-6 h-6 text-white" />}
    />
  );
}
