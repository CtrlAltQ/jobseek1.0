'use client'

import { Job } from '@/types/job';
import { getRelevanceColor, getRelevanceLabel } from '@/lib/jobUtils';

interface JobCardProps {
  job: Job;
  onStatusChange: (jobId: string, status: Job['applicationStatus']) => void;
  onViewDetails: (job: Job) => void;
}

export default function JobCard({ job, onStatusChange, onViewDetails }: JobCardProps) {
  const isNew = new Date(job.postedDate) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  
  const getStatusColor = (status: Job['applicationStatus']) => {
    switch (status) {
      case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'interview': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: Job['applicationStatus']) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'interview': return 'Interview';
      case 'rejected': return 'Rejected';
      default: return 'Not Applied';
    }
  };

  return (
    <div 
      onClick={() => onViewDetails(job)}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/50 transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors duration-300 group-hover:scale-105 transform">
              <span className="text-sm font-semibold text-gray-300 group-hover:text-blue-300 transition-colors duration-300">
                {job.company.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-400 text-sm">{job.company}</p>
            </div>
          </div>
        </div>
        
        {isNew && (
          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded border border-green-500/30">
            NEW
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-300">
            {job.isRemote ? 'Remote' : job.location}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="text-gray-300">{job.salary}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1h3zm8-4V2h-4v5h4V3z" />
          </svg>
          <span className="text-gray-400 text-xs">{job.source}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {job.requirements.slice(0, 4).map((req) => (
            <span
              key={req}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600"
            >
              {req}
            </span>
          ))}
          {job.requirements.length > 4 && (
            <span className="px-2 py-1 text-gray-400 text-xs">
              +{job.requirements.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Relevance:</span>
          <span className={`text-sm font-semibold ${getRelevanceColor(job.relevanceScore)}`}>
            {job.relevanceScore}% • {getRelevanceLabel(job.relevanceScore)}
          </span>
        </div>
        
        <div className="text-xs text-gray-400">
          {new Date(job.postedDate).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <span className={`px-3 py-1 text-xs font-medium rounded border ${getStatusColor(job.applicationStatus)}`}>
          {getStatusLabel(job.applicationStatus)}
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(job);
            }}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95 text-white text-xs font-medium rounded transition-all duration-200 transform hover:shadow-md"
          >
            View Details
          </button>
          
          {job.applicationStatus === 'not_applied' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(job.id, 'applied');
              }}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 text-white text-xs font-medium rounded transition-all duration-200 transform hover:shadow-md"
            >
              Apply
            </button>
          )}
          
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 hover:scale-105 active:scale-95 text-gray-200 text-xs font-medium rounded transition-all duration-200 transform hover:shadow-md"
          >
            External Link
          </a>
        </div>
      </div>
    </div>
  );
}