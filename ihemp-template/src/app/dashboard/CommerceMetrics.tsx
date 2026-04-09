'use client';

import { useState, useEffect } from 'react';
import { AMAZON_STORE_ID } from '@/lib/amazon';

interface CommerceMetric {
  category: 'amazon' | 'store' | 'products' | 'revenue';
  label: string;
  value: string | number;
  sublabel: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface ProductPerformance {
  id: string;
  title: string;
  clicks: number;
  revenue: number;
  conversion: string;
  category: string;
  status: 'active' | 'paused' | 'draft';
}

export default function CommerceMetrics() {
  const [metrics, setMetrics] = useState<CommerceMetric[]>([
    {
      category: 'amazon',
      label: 'Amazon Associates',
      value: '156',
      sublabel: 'Click-throughs',
      trend: 'up',
      change: '+12%'
    },
    {
      category: 'store',
      label: 'E-Commerce Revenue',
      value: '$2,450',
      sublabel: 'This month',
      trend: 'up',
      change: '+18%'
    },
    {
      category: 'products',
      label: 'Active Products',
      value: '47',
      sublabel: 'Across 18 sites',
      trend: 'stable',
      change: '0%'
    },
    {
      category: 'revenue',
      label: 'Product Reviews',
      value: '23',
      sublabel: 'Avg rating: 4.7★',
      trend: 'up',
      change: '+5%'
    }
  ]);

  const [products, setProducts] = useState<ProductPerformance[]>([
    {
      id: 'CBD-SALVE-STICKS',
      title: 'CBD Salve Stick Containers',
      clicks: 89,
      revenue: 420,
      conversion: '4.8%',
      category: 'Packaging',
      status: 'active'
    },
    {
      id: 'SHEA-BUTTER',
      title: 'Shea Butter for CBD Salve',
      clicks: 47,
      revenue: 280,
      conversion: '3.2%',
      category: 'Ingredients',
      status: 'active'
    },
    {
      id: 'COCONUT-OIL',
      title: 'Unrefined Coconut Oil for CBD Salve',
      clicks: 35,
      revenue: 190,
      conversion: '2.8%',
      category: 'Ingredients',
      status: 'active'
    },
    {
      id: 'CBD-SALVE-TINS',
      title: 'CBD Salve Tins',
      clicks: 28,
      revenue: 150,
      conversion: '2.1%',
      category: 'Packaging',
      status: 'active'
    },
    {
      id: 'MENTHOL-CBD',
      title: 'Menthol for CBD Salve',
      clicks: 15,
      revenue: 85,
      conversion: '1.8%',
      category: 'Additives',
      status: 'paused'
    }
  ]);

  const [selectedStore, setSelectedStore] = useState<'ihemp-international' | 'ihemp-harvest'>('ihemp-international');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
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

  const getMetricColor = (category: CommerceMetric['category']) => {
    switch (category) {
      case 'amazon': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'store': return 'bg-green-100 text-green-800 border-green-200';
      case 'products': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'revenue': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  // Simulate periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new clicks
      setProducts(prev => prev.map(product => ({
        ...product,
        clicks: product.status === 'active' 
          ? product.clicks + Math.floor(Math.random() * 3)
          : product.clicks
      })));

      // Update metrics
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.category === 'amazon'
          ? `${Number(metric.value.toString().replace(/[$,]/g, '')) + Math.floor(Math.random() * 2)}`
          : metric.value
      })));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const totalClicks = products.reduce((sum, product) => sum + product.clicks, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Commerce & Revenue Tracking</h3>
          <div className="text-sm text-gray-500 mt-1">
            <span className="font-medium">Amazon Store ID:</span> {AMAZON_STORE_ID}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Store:</span>
            <select 
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="ihemp-international">iHemp International</option>
              <option value="ihemp-harvest">iHemp Harvest</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-hemp-green text-white rounded-lg hover:bg-hemp-leaf transition text-sm">
            Export Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div 
              key={metric.category}
              className={`p-4 rounded-lg border ${getMetricColor(metric.category)}`}
            >
              <div className="text-sm text-gray-700 mb-1">{metric.label}</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{metric.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-hemp-green">${totalRevenue}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-hemp-leaf">{totalClicks}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-hemp-gold">
              {products.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Products</div>
          </div>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Top Performing Products</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{product.title}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{product.clicks}</td>
                  <td className="px-4 py-3 text-gray-900">${product.revenue}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      parseFloat(product.conversion) >= 4 
                        ? 'bg-green-100 text-green-800' 
                        : parseFloat(product.conversion) >= 3
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.conversion}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : product.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setProducts(prev => prev.map(p => 
                            p.id === product.id 
                              ? { ...p, status: p.status === 'active' ? 'paused' : 'active' }
                              : p
                          ));
                        }}
                        className={`px-3 py-1 text-xs rounded ${
                          product.status === 'active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {product.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amazon Associates Configuration */}
      <div className="p-4 bg-hemp-cream border-t border-hemp-gold/30">
        <h4 className="font-semibold text-hemp-brown mb-2">Amazon Associates Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">Current Rotation</div>
            <div className="font-medium">4/11 products active</div>
            <div className="text-xs text-gray-500">Recipe-focused selection for CBD salve tutorials</div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Products Held</div>
            <div className="font-medium">7 products awaiting rotation</div>
            <div className="text-xs text-gray-500">CBD Sample pending compliance review</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-hemp-green text-hemp-green rounded-lg hover:bg-hemp-green hover:text-white transition text-sm">
              Rotate Products
            </button>
            <button className="px-4 py-2 bg-hemp-green text-white rounded-lg hover:bg-hemp-leaf transition text-sm">
              Generate Performance Report
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Amazon links automatically include tracking tag: <code className="bg-gray-100 px-1 rounded">?tag=dcnotpc08-20</code>
          </p>
        </div>
      </div>
    </div>
  );
}