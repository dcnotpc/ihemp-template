'use client';

import { useState } from 'react';

export default function DashboardHeader() {
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date>(new Date());

  const handleRefresh = () => {
    setRefreshTimestamp(new Date());
    // In a real implementation, this would trigger data refetch
    console.log('Dashboard refresh triggered');
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-hemp-green" style={{ fontFamily: 'var(--font-fredoka)' }}>
            iHemp Operations Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            CEO Console for iHemp Marketing Network Monitoring
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Systems Operational
            </span>
            <span>•</span>
            <span>
              <strong>Auth:</strong> David Alan Crabill (CEO)
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-hemp-green text-white rounded-lg hover:bg-hemp-leaf transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
          
          <div className="text-sm text-gray-500">
            <div className="font-medium">Last refresh:</div>
            <div>{refreshTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </div>
      
      {/* Stats Summary Bar */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Network Sites</div>
          <div className="text-2xl font-bold text-hemp-green">18</div>
          <div className="text-xs text-gray-400">WordPress</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">E-Commerce Stores</div>
          <div className="text-2xl font-bold text-hemp-green">2</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Social Platforms</div>
          <div className="text-2xl font-bold text-hemp-green">9</div>
          <div className="text-xs text-gray-400">Managed</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">AI Agents</div>
          <div className="text-2xl font-bold text-hemp-green">8</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
      </div>
    </div>
  );
}