'use client'

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import JobGrid from '@/components/JobGrid';
import JobDetail from '@/components/JobDetail';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/types/job';

export default function Home() {
  const {
    filteredJobs,
    loading,
    error,
    searchJobsFromAPI,
    filterExistingJobs,
    handleStatusChange: updateJobStatus,
    jobCount
  } = useJobs();
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [lastApiSearch, setLastApiSearch] = useState('');

  // Initial load - search for jobs on mount
  useEffect(() => {
    if (isInitialLoad) {
      handleNewSearch('react developer');
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Filter existing jobs when filters change (but not search term)
  useEffect(() => {
    if (searchTerm === lastApiSearch) {
      // Only filter existing results if search term hasn't changed
      filterExistingJobs(searchTerm, locationFilter, sortBy);
    }
  }, [locationFilter, sortBy, filterExistingJobs, searchTerm, lastApiSearch]);

  const handleNewSearch = async (term: string) => {
    setLastApiSearch(term);
    await searchJobsFromAPI({
      search: term,
      location: locationFilter === 'all' ? 'nashville' : locationFilter,
      limit: 20
    });
  };

  const handleStatusChange = (jobId: string, status: Job['applicationStatus']) => {
    updateJobStatus(jobId, status);
    
    // Update selected job if it's the one being changed
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, applicationStatus: status });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // If search term is significantly different, make new API call
    if (term !== lastApiSearch && term.length > 2) {
      handleNewSearch(term);
    } else if (term === '') {
      // If cleared, search for default term
      handleNewSearch('react developer');
    }
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
        jobCount={jobCount}
        loading={loading}
        error={error}
        onRetry={() => handleNewSearch(searchTerm || 'react developer')}
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