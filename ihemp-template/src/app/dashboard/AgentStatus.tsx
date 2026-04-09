'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error' | 'offline';
  currentTask: string;
  tasksCompleted: number;
  lastActivity: string;
  complianceAuthority: boolean;
  qaAuthority: boolean;
  vetoPower: boolean;
}

export default function AgentStatus() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'research',
      name: 'Research Agent',
      role: 'Fact-finding and source verification',
      status: 'active',
      currentTask: 'Verifying 2026 hemp regulations',
      tasksCompleted: 42,
      lastActivity: '2 minutes ago',
      complianceAuthority: false,
      qaAuthority: false,
      vetoPower: false
    },
    {
      id: 'content',
      name: 'Content Agent',
      role: 'Draft creation across all platforms',
      status: 'active',
      currentTask: 'Writing Michigan CBD guide',
      tasksCompleted: 28,
      lastActivity: '5 minutes ago',
      complianceAuthority: false,
      qaAuthority: false,
      vetoPower: false
    },
    {
      id: 'seo',
      name: 'SEO Agent',
      role: 'Search optimization and keyword research',
      status: 'active',
      currentTask: 'Optimizing California hemp content',
      tasksCompleted: 35,
      lastActivity: '1 minute ago',
      complianceAuthority: false,
      qaAuthority: false,
      vetoPower: false
    },
    {
      id: 'compliance',
      name: 'Compliance Agent',
      role: 'Legal and regulatory review',
      status: 'idle',
      currentTask: 'Awaiting content for review',
      tasksCompleted: 18,
      lastActivity: '15 minutes ago',
      complianceAuthority: true,
      qaAuthority: false,
      vetoPower: true
    },
    {
      id: 'qa',
      name: 'QA Agent',
      role: 'Final review before publishing',
      status: 'active',
      currentTask: 'Reviewing SEO-optimized content',
      tasksCompleted: 56,
      lastActivity: 'Now',
      complianceAuthority: false,
      qaAuthority: true,
      vetoPower: false
    },
    {
      id: 'social',
      name: 'Social Media Agent',
      role: 'Platform-specific content distribution',
      status: 'active',
      currentTask: 'Scheduling posts for 9 platforms',
      tasksCompleted: 89,
      lastActivity: '3 minutes ago',
      complianceAuthority: false,
      qaAuthority: false,
      vetoPower: false
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Agent',
      role: 'Store operations and product content',
      status: 'active',
      currentTask: 'Updating Amazon Associates links',
      tasksCompleted: 47,
      lastActivity: 'Now',
      complianceAuthority: false,
      qaAuthority: false,
      vetoPower: false
    },
    {
      id: 'email',
      name: 'Email Agent',
      role: 'Email marketing campaigns',
      status: 'idle',
      currentTask: 'Preparing weekly newsletter',
      tasksCompleted: 22,
      lastActivity: '30 minutes ago',
      complianceAuthority: false,
      qaAuthority: false,
      vetoPower: false
    }
  ]);

  const [showDetails, setShowDetails] = useState<string | null>(null);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'idle': return 'Idle';
      case 'error': return 'Error';
      case 'offline': return 'Offline';
    }
  };

  const handleAgentToggle = (agentId: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === agentId) {
        const newStatus = agent.status === 'active' ? 'idle' : 'active';
        return {
          ...agent,
          status: newStatus,
          lastActivity: 'Now'
        };
      }
      return agent;
    }));
  };

  // Simulate agent activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        // Randomly update activity for some agents
        if (Math.random() > 0.7 && agent.status === 'active') {
          return {
            ...agent,
            tasksCompleted: agent.tasksCompleted + 1,
            lastActivity: 'Just now'
          };
        }
        return agent;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleDetails = (agentId: string) => {
    setShowDetails(showDetails === agentId ? null : agentId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Agent Stats Overview */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {agents.filter(a => a.status === 'idle').length}
            </div>
            <div className="text-sm text-gray-600">Idle</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)}
            </div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-hemp-green">{agents.length}</div>
            <div className="text-sm text-gray-600">Total Agents</div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="divide-y divide-gray-200">
        {agents.map((agent) => (
          <div key={agent.id} className="p-4 hover:bg-gray-50 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    {agent.complianceAuthority && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Compliance</span>
                    )}
                    {agent.qaAuthority && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">QA</span>
                    )}
                    {agent.vetoPower && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">VETO</span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{agent.role}</p>
                
                <div className="text-sm text-gray-500">
                  <div className="mb-1">
                    <span className="font-medium">Current Task:</span> {agent.currentTask}
                  </div>
                  <div className="flex gap-4">
                    <span>
                      <span className="font-medium">Tasks:</span> {agent.tasksCompleted}
                    </span>
                    <span>
                      <span className="font-medium">Last Activity:</span> {agent.lastActivity}
                    </span>
                    <span>
                      <span className="font-medium">Status:</span> {getStatusText(agent.status)}
                    </span>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {showDetails === agent.id && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Agent Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Agent ID</div>
                        <div className="font-mono">{agent.id}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Priority</div>
                        <div>
                          {agent.complianceAuthority || agent.qaAuthority ? 'High' : 'Standard'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Authority Level</div>
                        <div>
                          {agent.vetoPower ? 'VETO Power' : 
                           agent.complianceAuthority ? 'Compliance Review' :
                           agent.qaAuthority ? 'QA Approval' : 'Standard'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Scheduled Tasks</div>
                        <div>2 pending</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => toggleDetails(agent.id)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {showDetails === agent.id ? 'Hide' : 'Details'}
                </button>
                <button
                  onClick={() => handleAgentToggle(agent.id)}
                  className={`px-3 py-1 text-sm rounded ${
                    agent.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {agent.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button className="px-3 py-1 text-sm bg-hemp-green text-white rounded hover:bg-hemp-leaf">
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assembly Line Visualization */}
      <div className="p-4 bg-hemp-cream border-t border-hemp-gold/30">
        <h4 className="font-semibold text-hemp-brown mb-3">Content Assembly Line Flow</h4>
        <div className="flex items-center justify-between text-sm mb-2">
          {['Research', 'Content', 'SEO', 'Compliance', 'QA', 'Publish'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                index === 0 ? 'bg-green-500 text-white' :
                index === 1 ? 'bg-blue-500 text-white' :
                index === 2 ? 'bg-yellow-500 text-white' :
                index === 3 ? 'bg-orange-500 text-white' :
                index === 4 ? 'bg-purple-500 text-white' :
                'bg-hemp-green text-white'
              }`}>
                {index + 1}
              </div>
              <div className="font-medium">{step}</div>
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-hemp-leaf transition-all duration-500"
            style={{ width: '66%' }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Current flow: 66% complete (4/6 stages active)
        </p>
        
        {/* Authority Hierarchy */}
        <div className="mt-4 p-3 bg-white rounded-lg border border-hemp-gold/30">
          <h5 className="font-medium text-hemp-brown mb-2">Authority Hierarchy</h5>
          <ol className="text-sm space-y-1 pl-5 list-decimal">
            <li className="text-red-600 font-medium">David Alan Crabill — CEO, final authority</li>
            <li className="text-red-600 font-medium">Compliance Agent — Can veto any content</li>
            <li className="text-blue-600 font-medium">QA Agent — Can block publishing</li>
            <li className="text-gray-600">All other agents operate at equal level</li>
          </ol>
        </div>
      </div>
    </div>
  );
}