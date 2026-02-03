import LabPageTemplate from '@/components/lab-page-template';
import { FileText } from 'lucide-react';

export default function TFIDFBOWPage() {
  return (
    <LabPageTemplate
      title="TF-IDF / BOW"
      description="Classical text vectorization with term frequency and bag-of-words"
      icon={<FileText className="w-6 h-6 text-white" />}
    />
  );
}
