'use client'

import { Job } from '@/types/job';
import JobCard from './JobCard';

interface JobGridProps {
  jobs: Job[];
  onStatusChange: (jobId: string, status: Job['applicationStatus']) => void;
  onViewDetails: (job: Job) => void;
  loading?: boolean;
}

export default function JobGrid({ jobs, onStatusChange, onViewDetails, loading = false }: JobGridProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-32"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg shimmer"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2 shimmer"></div>
                  <div className="h-3 bg-gray-700 rounded w-24 shimmer"></div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-700 rounded shimmer"></div>
                  <div className="h-3 bg-gray-700 rounded w-16 shimmer"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-700 rounded shimmer"></div>
                  <div className="h-3 bg-gray-700 rounded w-20 shimmer"></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="space-y-2 mb-3">
                  <div className="h-3 bg-gray-700 rounded shimmer"></div>
                  <div className="h-3 bg-gray-700 rounded w-4/5 shimmer"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4 shimmer"></div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-700 rounded w-16 shimmer"></div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-gray-700 rounded w-16 shimmer"></div>
                  <div className="h-3 bg-gray-700 rounded w-20 shimmer"></div>
                </div>
                <div className="h-3 bg-gray-700 rounded w-12 shimmer"></div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="h-6 bg-gray-700 rounded w-20 shimmer"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-700 rounded w-16 shimmer"></div>
                  <div className="h-6 bg-gray-700 rounded w-12 shimmer"></div>
                  <div className="h-6 bg-gray-700 rounded w-20 shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No jobs found</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or filters to find more opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors">
            Clear Filters
          </button>
          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 font-medium rounded transition-colors">
            View All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Sorted by relevance</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <div 
            key={job.id}
            className="job-card-enter"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <JobCard
              job={job}
              onStatusChange={onStatusChange}
              onViewDetails={onViewDetails}
            />
          </div>
        ))}
      </div>
      
      {jobs.length > 0 && (
        <div className="text-center pt-8">
          <p className="text-gray-400 text-sm mb-4">
            End of results • {jobs.length} jobs shown
          </p>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded transition-colors border border-gray-600">
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
}