import LabPageTemplate from '@/components/lab-page-template';
import { Zap } from 'lucide-react';

export default function EncoderDecoderPage() {
  return (
    <LabPageTemplate
      title="Encoder/Decoder Architecture"
      description="Build transformer models with encoder-decoder structure"
      icon={<Zap className="w-6 h-6 text-white" />}
    />
  );
}
