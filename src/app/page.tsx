'use client'

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import JobGrid from '@/components/JobGrid';
import JobDetail from '@/components/JobDetail';
import ErrorBoundary from '@/components/ErrorBoundary';
import { mockJobs } from '@/lib/mockJobs';
import { filterJobs, updateJobStatus } from '@/lib/jobUtils';
import { Job } from '@/types/job';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Update filtered jobs when filters change
  useEffect(() => {
    setLoading(true);
    // Simulate async filtering for better UX
    const timeoutId = setTimeout(() => {
      const filtered = filterJobs(
        jobs,
        searchTerm,
        locationFilter,
        0,
        200000,
        [],
        sortBy
      );
      setFilteredJobs(filtered);
      setLoading(false);
    }, 200); // Small delay to show loading state

    return () => clearTimeout(timeoutId);
  }, [jobs, searchTerm, locationFilter, sortBy]);

  const handleStatusChange = (jobId: string, status: Job['applicationStatus']) => {
    const updatedJobs = updateJobStatus(jobs, jobId, status);
    setJobs(updatedJobs);
    
    // Update selected job if it's the one being changed
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, applicationStatus: status });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setSortBy('relevance');
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      
      <FilterBar
        onSearch={handleSearch}
        onLocationFilter={handleLocationFilter}
        onSalaryFilter={() => {}} // TODO: Implement salary filter
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        jobCount={filteredJobs.length}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <JobGrid
            jobs={filteredJobs}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
            loading={loading}
          />
        </ErrorBoundary>
      </main>
      
      <JobDetail
        job={selectedJob}
        onClose={handleCloseDetails}
        onStatusChange={handleStatusChange}
      />
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">
              AI Job Finder MVP • Built with Next.js, React, and TailwindCSS
            </p>
            <p className="text-gray-500 text-xs">
              Created for Jeremy Clegg • Front-End Developer & Automation Specialist
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}