import LabPageTemplate from '@/components/lab-page-template';
import { Play } from 'lucide-react';

export default function DQNPage() {
  return (
    <LabPageTemplate
      title="Deep Q-Networks"
      description="Deep learning for Q-learning with experience replay"
      icon={<Play className="w-6 h-6 text-white" />}
    />
  );
}
