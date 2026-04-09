import DashboardHeader from './DashboardHeader';
import SystemMetrics from './SystemMetrics';
import ContentReview from './ContentReview';
import AgentStatus from './AgentStatus';
import CommerceMetrics from './CommerceMetrics';
import { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

export const metadata = {
  title: 'iHemp Operations Dashboard | CEO Console',
  description: 'Real-time monitoring and management console for iHemp Marketing Network',
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Dashboard Header */}
          <DashboardHeader />
          
          {/* Key Metrics Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-hemp-green mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>
              System Overview
            </h2>
            <SystemMetrics />
          </div>

          {/* Content & Operations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-hemp-green mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>
                Content Review
              </h2>
              <ContentReview />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-hemp-green mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>
                Agent Operations
              </h2>
              <AgentStatus />
            </div>
          </div>

          {/* Commerce & Revenue */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-hemp-green mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>
              Commerce & Revenue
            </h2>
            <CommerceMetrics />
          </div>

          {/* Footer Notes */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p className="mb—2"><strong>Last Updated:</strong> {new Date().toLocaleString('en-US', { 
                timeZone: 'America/Detroit',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} EDT</p>
              <p><strong>Data Sources:</strong> OpenClaw API, WordPress REST API, Vercel Analytics, Amazon Associates</p>
            </div>
          </div>

        </div>
      </Suspense>
    </div>
  );
}