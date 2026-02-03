import LabPageTemplate from '@/components/lab-page-template';
import { Sparkles } from 'lucide-react';

export default function VAEPage() {
  return (
    <LabPageTemplate
      title="Variational Autoencoders"
      description="Learn latent space representations for generative modeling"
      icon={<Sparkles className="w-6 h-6 text-white" />}
    />
  );
}
