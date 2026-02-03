import LabPageTemplate from '@/components/lab-page-template';
import { FileText } from 'lucide-react';

export default function TextPreprocessingPage() {
  return (
    <LabPageTemplate
      title="Text Preprocessing"
      description="Clean and prepare text data for NLP tasks"
      icon={<FileText className="w-6 h-6 text-white" />}
    />
  );
}
