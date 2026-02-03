import LabPageTemplate from '@/components/lab-page-template';
import { Brain } from 'lucide-react';

export default function RNNLSTMPage() {
  return (
    <LabPageTemplate
      title="RNN / LSTM"
      description="Recurrent networks for sequential data and time series analysis"
      icon={<Brain className="w-6 h-6 text-white" />}
    />
  );
}
