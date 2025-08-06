import { Job } from '@/types/job';
import { calculateRelevanceScore } from './aiScoring';

const PYTHON_BACKEND_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:5000';

export interface JobSearchParams {
  search?: string;
  location?: string;
  limit?: number;
}

export interface JobApiResponse {
  jobs: Job[];
  total: number;
  message?: string;
  error?: string;
}

export class JobApiService {
  private static async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 30000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  static async searchJobs(params: JobSearchParams): Promise<JobApiResponse> {
    try {
      const searchParams = new URLSearchParams({
        search: params.search || 'frontend developer',
        location: params.location || 'nashville',
        limit: (params.limit || 20).toString(),
      });

      console.log(`Searching jobs: ${PYTHON_BACKEND_URL}/api/jobs/search?${searchParams}`);

      const response = await this.fetchWithTimeout(
        `${PYTHON_BACKEND_URL}/api/jobs/search?${searchParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: JobApiResponse = await response.json();

      // Enhanced AI scoring for each job
      if (data.jobs && data.jobs.length > 0) {
        data.jobs = data.jobs.map(job => ({
          ...job,
          relevanceScore: calculateRelevanceScore(job)
        }));

        // Sort by relevance score (highest first)
        data.jobs.sort((a, b) => b.relevanceScore - a.relevanceScore);
      }

      return data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      
      // Return fallback response
      return {
        jobs: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs'
      };
    }
  }

  static async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(
        `${PYTHON_BACKEND_URL}/api/health`,
        { method: 'GET' },
        5000 // 5 second timeout for health check
      );
      
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // Fallback method using mock data when backend is unavailable
  static async searchJobsWithFallback(params: JobSearchParams): Promise<JobApiResponse> {
    // First try the real API
    const isBackendHealthy = await this.checkBackendHealth();
    
    if (isBackendHealthy) {
      const result = await this.searchJobs(params);
      if (result.jobs.length > 0) {
        return result;
      }
    }

    // Fallback to mock data
    console.log('Using fallback mock data');
    const { mockJobs } = await import('./mockJobs');
    const { filterJobs } = await import('./jobUtils');

    const filteredJobs = filterJobs(
      mockJobs,
      params.search || '',
      params.location || 'all',
      0,
      200000,
      [],
      'relevance'
    );

    return {
      jobs: filteredJobs.slice(0, params.limit || 20),
      total: filteredJobs.length,
      message: 'Using fallback data - backend unavailable'
    };
  }
}

// Convenience functions
export const searchJobs = (params: JobSearchParams) => JobApiService.searchJobsWithFallback(params);
export const checkBackendHealth = () => JobApiService.checkBackendHealth();