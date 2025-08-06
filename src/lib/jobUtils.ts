import { Job } from '@/types/job';

export const filterJobs = (
  jobs: Job[],
  searchTerm: string = '',
  location: string = 'all',
  minSalary: number = 0,
  maxSalary: number = 200000,
  jobTypes: string[] = [],
  sortBy: string = 'relevance'
): Job[] => {
  let filtered = jobs.filter(job => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));

    // Location filter
    const matchesLocation = location === 'all' || 
      (location === 'remote' && job.isRemote) ||
      (location === 'nashville' && job.location.toLowerCase().includes('nashville')) ||
      (location === 'both' && (job.isRemote || job.location.toLowerCase().includes('nashville')));

    // Salary filter (extract numeric values from salary string)
    const salaryNumbers = job.salary.match(/\d+,?\d*/g)?.map(s => parseInt(s.replace(',', ''))) || [0];
    const jobMinSalary = Math.min(...salaryNumbers);
    const jobMaxSalary = Math.max(...salaryNumbers);
    const matchesSalary = jobMaxSalary >= minSalary && jobMinSalary <= maxSalary;

    // Job type filter
    const matchesJobTypes = jobTypes.length === 0 || 
      jobTypes.some(type => job.tags.includes(type));

    return matchesSearch && matchesLocation && matchesSalary && matchesJobTypes;
  });

  // Sort jobs
  switch (sortBy) {
    case 'relevance':
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
      break;
    case 'date':
      filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      break;
    case 'salary':
      filtered.sort((a, b) => {
        const aSalary = Math.max(...(a.salary.match(/\d+,?\d*/g)?.map(s => parseInt(s.replace(',', ''))) || [0]));
        const bSalary = Math.max(...(b.salary.match(/\d+,?\d*/g)?.map(s => parseInt(s.replace(',', ''))) || [0]));
        return bSalary - aSalary;
      });
      break;
    case 'company':
      filtered.sort((a, b) => a.company.localeCompare(b.company));
      break;
  }

  return filtered;
};

export const getJobStats = (jobs: Job[]) => {
  return {
    total: jobs.length,
    notApplied: jobs.filter(job => job.applicationStatus === 'not_applied').length,
    applied: jobs.filter(job => job.applicationStatus === 'applied').length,
    interviews: jobs.filter(job => job.applicationStatus === 'interview').length,
    rejected: jobs.filter(job => job.applicationStatus === 'rejected').length,
    remote: jobs.filter(job => job.isRemote).length,
    local: jobs.filter(job => !job.isRemote).length,
    averageRelevance: Math.round(jobs.reduce((sum, job) => sum + job.relevanceScore, 0) / jobs.length)
  };
};

export const updateJobStatus = (jobs: Job[], jobId: string, status: Job['applicationStatus']): Job[] => {
  return jobs.map(job => 
    job.id === jobId ? { ...job, applicationStatus: status } : job
  );
};

export const getRelevanceColor = (score: number): string => {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-yellow-400';
  if (score >= 70) return 'text-orange-400';
  return 'text-red-400';
};

export const getRelevanceLabel = (score: number): string => {
  if (score >= 90) return 'Excellent Match';
  if (score >= 80) return 'Good Match';
  if (score >= 70) return 'Fair Match';
  return 'Poor Match';
};