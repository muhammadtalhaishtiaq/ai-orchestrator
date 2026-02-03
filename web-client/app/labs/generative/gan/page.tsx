import LabPageTemplate from '@/components/lab-page-template';
import { Sparkles } from 'lucide-react';

export default function GANPage() {
  return (
    <LabPageTemplate
      title="Generative Adversarial Networks"
      description="Adversarial training with generator and discriminator networks"
      icon={<Sparkles className="w-6 h-6 text-white" />}
    />
  );
}
