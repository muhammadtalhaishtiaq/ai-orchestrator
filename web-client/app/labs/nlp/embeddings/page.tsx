import LabPageTemplate from '@/components/lab-page-template';
import { FileText } from 'lucide-react';

export default function EmbeddingsPage() {
  return (
    <LabPageTemplate
      title="Word Embeddings"
      description="Vector representations: Word2Vec, GloVe, and contextual embeddings"
      icon={<FileText className="w-6 h-6 text-white" />}
    />
  );
}
