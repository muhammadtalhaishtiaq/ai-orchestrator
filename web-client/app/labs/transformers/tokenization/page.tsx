import LabPageTemplate from '@/components/lab-page-template';
import { Zap } from 'lucide-react';

export default function TokenizationPage() {
  return (
    <LabPageTemplate
      title="Tokenization"
      description="Text tokenization strategies: BPE, WordPiece, and SentencePiece"
      icon={<Zap className="w-6 h-6 text-white" />}
    />
  );
}
