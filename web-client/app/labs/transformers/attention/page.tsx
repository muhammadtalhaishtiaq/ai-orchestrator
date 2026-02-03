import LabPageTemplate from '@/components/lab-page-template';
import { Zap } from 'lucide-react';

export default function AttentionPage() {
  return (
    <LabPageTemplate
      title="Attention Mechanism"
      description="Learn self-attention and multi-head attention for sequence modeling"
      icon={<Zap className="w-6 h-6 text-white" />}
    />
  );
}
