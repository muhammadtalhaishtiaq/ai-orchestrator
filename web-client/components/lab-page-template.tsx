import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface LabPageTemplateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function LabPageTemplate({ title, description, icon, children }: LabPageTemplateProps) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Card className="p-8 bg-gradient-to-br from-[#1f2937] to-[#1a1f2e] border-cyan-500/20">
        {children || (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">This lab is currently under construction.</p>
            <p className="text-gray-500 text-sm">Check back soon for interactive experiments and tutorials.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
