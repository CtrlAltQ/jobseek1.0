'use client'

import { Job } from '@/types/job';
import { getRelevanceColor, getRelevanceLabel } from '@/lib/jobUtils';

interface JobDetailProps {
  job: Job | null;
  onClose: () => void;
  onStatusChange: (jobId: string, status: Job['applicationStatus']) => void;
}

export default function JobDetail({ job, onClose, onStatusChange }: JobDetailProps) {
  if (!job) return null;

  const getStatusColor = (status: Job['applicationStatus']) => {
    switch (status) {
      case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'interview': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-300">
                {job.company.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100">{job.title}</h2>
              <p className="text-lg text-gray-400">{job.company}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Location</div>
              <div className="text-gray-200 font-medium">
                {job.isRemote ? 'Remote' : job.location}
              </div>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Salary</div>
              <div className="text-gray-200 font-medium">{job.salary}</div>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Posted</div>
              <div className="text-gray-200 font-medium">
                {new Date(job.postedDate).toLocaleDateString()}
              </div>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Source</div>
              <div className="text-gray-200 font-medium">{job.source}</div>
            </div>
          </div>

          {/* Relevance Score */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-200">AI Relevance Analysis</h3>
              <span className={`text-2xl font-bold ${getRelevanceColor(job.relevanceScore)}`}>
                {job.relevanceScore}%
              </span>
            </div>
            <p className={`text-sm ${getRelevanceColor(job.relevanceScore)}`}>
              {getRelevanceLabel(job.relevanceScore)} • This position aligns well with your React, JavaScript, and automation experience
            </p>
            <div className="mt-3 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${job.relevanceScore >= 90 ? 'bg-green-400' : job.relevanceScore >= 80 ? 'bg-yellow-400' : job.relevanceScore >= 70 ? 'bg-orange-400' : 'bg-red-400'}`}
                style={{ width: `${job.relevanceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Job Description</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {job.requirements.map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm border border-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Status and Actions */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Application Status</h3>
                <span className={`px-4 py-2 text-sm font-medium rounded border ${getStatusColor(job.applicationStatus)}`}>
                  {job.applicationStatus === 'not_applied' ? 'Not Applied' : 
                   job.applicationStatus === 'applied' ? 'Applied' :
                   job.applicationStatus === 'interview' ? 'Interview Scheduled' : 'Rejected'}
                </span>
              </div>
              
              <div className="flex gap-3">
                {job.applicationStatus === 'not_applied' && (
                  <button
                    onClick={() => onStatusChange(job.id, 'applied')}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition-colors"
                  >
                    Mark as Applied
                  </button>
                )}
                
                {job.applicationStatus === 'applied' && (
                  <button
                    onClick={() => onStatusChange(job.id, 'interview')}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
                  >
                    Schedule Interview
                  </button>
                )}
                
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors inline-flex items-center gap-2"
                >
                  View Original Posting
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}