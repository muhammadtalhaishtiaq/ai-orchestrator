import LabPageTemplate from '@/components/lab-page-template';
import { Brain } from 'lucide-react';

export default function CNNWorkshopPage() {
  return (
    <LabPageTemplate
      title="CNN Workshop"
      description="Convolutional Neural Networks for image recognition and computer vision"
      icon={<Brain className="w-6 h-6 text-white" />}
    />
  );
}
