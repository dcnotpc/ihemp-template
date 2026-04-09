'use client';

import { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  state: string;
  status: 'draft' | 'review' | 'published' | 'needs_revision';
  date: string;
  author: string;
  agent: string;
  complianceApproved: boolean;
  qaApproved: boolean;
}

export default function ContentReview() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Michigan Hemp Farming Regulations 2024',
      state: 'Michigan',
      status: 'published',
      date: '2026-04-08',
      author: 'Content Agent',
      agent: 'content',
      complianceApproved: true,
      qaApproved: true
    },
    {
      id: '2',
      title: 'CBD Salve Recipe: DIY Tutorial',
      state: 'Multi-state',
      status: 'draft',
      date: '2026-04-09',
      author: 'Content Agent',
      agent: 'content',
      complianceApproved: false,
      qaApproved: false
    },
    {
      id: '3',
      title: 'California Industrial Hemp Market Analysis',
      state: 'California',
      status: 'review',
      date: '2026-04-09',
      author: 'Research Agent',
      agent: 'research',
      complianceApproved: true,
      qaApproved: false
    },
    {
      id: '4',
      title: 'Hemp Building Materials Guide',
      state: 'National',
      status: 'needs_revision',
      date: '2026-04-07',
      author: 'SEO Agent',
      agent: 'seo',
      complianceApproved: false,
      qaApproved: false
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  
  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.status === filter);

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'needs_revision': return 'bg-red-100 text-red-800';
    }
  };

  const handleApprove = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, complianceApproved: true, qaApproved: true, status: 'published' as const }
        : post
    ));
  };

  const handleRequestRevision = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, complianceApproved: false, qaApproved: false, status: 'needs_revision' as const }
        : post
    ));
  };

  const statusCounts = {
    draft: posts.filter(p => p.status === 'draft').length,
    review: posts.filter(p => p.status === 'review').length,
    published: posts.filter(p => p.status === 'published').length,
    needs_revision: posts.filter(p => p.status === 'needs_revision').length,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Stats Overview */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.draft}</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.review}</div>
            <div className="text-sm text-gray-600">In Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.published}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.needs_revision}</div>
            <div className="text-sm text-gray-600">Needs Revision</div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-lg ${filter === 'all' ? 'bg-hemp-green text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All ({posts.length})
          </button>
          <button 
            onClick={() => setFilter('draft')}
            className={`px-3 py-1 text-sm rounded-lg ${filter === 'draft' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
          >
            Draft ({statusCounts.draft})
          </button>
          <button 
            onClick={() => setFilter('review')}
            className={`px-3 py-1 text-sm rounded-lg ${filter === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}
          >
            Review ({statusCounts.review})
          </button>
        </div>
        <button className="px-4 py-2 bg-hemp-green text-white rounded-lg hover:bg-hemp-leaf transition text-sm">
          + New Draft
        </button>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compliance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">
                      {post.state} • {post.date} • {post.author}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                    {post.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {post.complianceApproved ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {post.qaApproved ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-yellow-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(post.id)}
                      disabled={post.status === 'published'}
                      className={`px-3 py-1 rounded text-sm ${
                        post.status === 'published' 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-hemp-green text-white hover:bg-hemp-leaf'
                      }`}
                    >
                      {post.status === 'published' ? 'Published' : 'Approve'}
                    </button>
                    <button 
                      onClick={() => handleRequestRevision(post.id)}
                      disabled={post.status === 'needs_revision'}
                      className={`px-3 py-1 rounded text-sm ${
                        post.status === 'needs_revision'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      Request Revision
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assembly Line Status */}
      <div className="p-4 bg-hemp-cream border-t border-hemp-gold/30">
        <h4 className="font-semibold text-hemp-brown mb-2">Content Assembly Line Status</h4>
        <div className="flex items-center justify-between text-sm">
          <div className="text-green-600 font-medium">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Research → Content
            </span>
          </div>
          <div className="text-yellow-600 font-medium">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              Content → SEO
            </span>
          </div>
          <div className="text-yellow-600 font-medium">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              SEO → Compliance
            </span>
          </div>
          <div className="text-red-600 font-medium">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
              </svg>
              Compliance → QA
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          1 post awaiting Compliance approval, 2 in QA review
        </p>
      </div>
    </div>
  );
}