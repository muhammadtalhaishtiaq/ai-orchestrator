import LabPageTemplate from '@/components/lab-page-template';
import { Users } from 'lucide-react';

export default function KMeansPage() {
  return (
    <LabPageTemplate
      title="K-Means Clustering"
      description="Partition data into K distinct clusters using centroid-based grouping"
      icon={<Users className="w-6 h-6 text-white" />}
    />
  );
}
