import LabPageTemplate from '@/components/lab-page-template';
import { Zap } from 'lucide-react';

export default function LLMUtilitiesPage() {
  return (
    <LabPageTemplate
      title="LLM Utilities"
      description="Tools and utilities for working with Large Language Models"
      icon={<Zap className="w-6 h-6 text-white" />}
    />
  );
}
