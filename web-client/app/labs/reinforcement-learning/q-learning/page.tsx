import LabPageTemplate from '@/components/lab-page-template';
import { Play } from 'lucide-react';

export default function QLearningPage() {
  return (
    <LabPageTemplate
      title="Q-Learning"
      description="Value-based reinforcement learning with Q-tables"
      icon={<Play className="w-6 h-6 text-white" />}
    />
  );
}
