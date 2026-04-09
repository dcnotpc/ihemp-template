'use client';

import { useState, useEffect } from 'react';

interface SystemMetric {
  id: string;
  label: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  description: string;
}

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'openclaw-status',
      label: 'OpenClaw Status',
      value: 'Active',
      status: 'healthy',
      description: 'Agent system operational'
    },
    {
      id: 'token-usage',
      label: 'Token Usage',
      value: '1,250',
      status: 'healthy',
      trend: 'stable',
      description: 'This period usage'
    },
    {
      id: 'vercel-deployments',
      label: 'Vercel Deployments',
      value: '18/18',
      status: 'healthy',
      description: 'Sites deployed'
    },
    {
      id: 'url-health',
      label: 'URL Health',
      value: '98%',
      status: 'healthy',
      trend: 'up',
      description: 'State program links'
    },
    {
      id: 'api-status',
      label: 'API Status',
      value: 'All Systems Go',
      status: 'healthy',
      description: 'External integrations'
    },
    {
      id: 'compliance-status',
      label: 'Compliance Status',
      value: 'Active',
      status: 'healthy',
      description: 'SOUL.md enforcement'
    }
  ]);

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case 'stable':
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  // Simulate periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, this would fetch from APIs
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        // Simulate minor value changes for demo
        ...(metric.id === 'token-usage' ? { 
          value: `${Math.floor(Math.random() * 100) + 1200}` 
        } : {})
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div 
          key={metric.id}
          className={`p-4 rounded-lg border ${getStatusColor(metric.status)} transition-transform hover:scale-[1.02]`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{metric.label}</h3>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.trend && (
                  <div className="flex items-center">
                    {getTrendIcon(metric.trend)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                metric.status === 'healthy' ? 'bg-green-200 text-green-800' :
                metric.status === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                'bg-red-200 text-red-800'
              }`}>
                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{metric.description}</p>
        </div>
      ))}
      
      {/* Quick Actions */}
      <div className="col-span-full mt-4 p-4 bg-hemp-cream rounded-lg border border-hemp-gold/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-hemp-brown">Quick Actions</h4>
            <p className="text-sm text-gray-600">System maintenance and diagnostics</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-hemp-green text-hemp-green rounded-lg hover:bg-hemp-green hover:text-white transition text-sm">
              Run Diagnostics
            </button>
            <button className="px-4 py-2 bg-hemp-green text-white rounded-lg hover:bg-hemp-leaf transition text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}