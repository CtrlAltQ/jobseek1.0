import { useState, useCallback } from 'react';
import { Job } from '@/types/job';
import { searchJobs, JobSearchParams } from '@/lib/jobApiService';
import { filterJobs, updateJobStatus } from '@/lib/jobUtils';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<JobSearchParams>({});

  // Search jobs from API
  const searchJobsFromAPI = useCallback(async (params: JobSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchJobs(params);
      
      if (response.error) {
        setError(response.error);
      } else {
        setJobs(response.jobs);
        setFilteredJobs(response.jobs);
        setLastSearchParams(params);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter existing jobs
  const filterExistingJobs = useCallback((
    searchTerm: string = '',
    locationFilter: string = 'all',
    sortBy: string = 'relevance'
  ) => {
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
  }, [jobs]);

  // Update job application status
  const handleStatusChange = useCallback((jobId: string, status: Job['applicationStatus']) => {
    const updatedJobs = updateJobStatus(jobs, jobId, status);
    setJobs(updatedJobs);
    
    // Update filtered jobs as well
    const updatedFilteredJobs = updateJobStatus(filteredJobs, jobId, status);
    setFilteredJobs(updatedFilteredJobs);
  }, [jobs, filteredJobs]);

  // Refresh current search
  const refreshJobs = useCallback(() => {
    if (Object.keys(lastSearchParams).length > 0) {
      searchJobsFromAPI(lastSearchParams);
    }
  }, [lastSearchParams, searchJobsFromAPI]);

  return {
    // Data
    jobs,
    filteredJobs,
    loading,
    error,
    
    // Actions
    searchJobsFromAPI,
    filterExistingJobs,
    handleStatusChange,
    refreshJobs,
    
    // Utils
    clearError: () => setError(null),
    jobCount: filteredJobs.length,
    totalJobs: jobs.length
  };
};