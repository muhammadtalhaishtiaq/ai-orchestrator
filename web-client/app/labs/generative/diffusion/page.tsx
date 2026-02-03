import LabPageTemplate from '@/components/lab-page-template';
import { Sparkles } from 'lucide-react';

export default function DiffusionPage() {
  return (
    <LabPageTemplate
      title="Diffusion Models"
      description="Generate images using denoising diffusion probabilistic models"
      icon={<Sparkles className="w-6 h-6 text-white" />}
    />
  );
}
