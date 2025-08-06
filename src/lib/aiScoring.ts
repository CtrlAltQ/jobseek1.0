import { Job } from '@/types/job';

// Jeremy's skill set and preferences
const JEREMY_PROFILE = {
  skills: {
    primary: ['React', 'JavaScript', 'Python', 'Next.js', 'TailwindCSS'],
    secondary: ['TypeScript', 'Node.js', 'HTML', 'CSS', 'Git'],
    emerging: ['AI/ML', 'Automation', 'APIs', 'AWS']
  },
  preferences: {
    remoteWeight: 1.1, // 10% boost for remote jobs
    locationPreference: ['Nashville', 'Remote'],
    salaryMin: 65000,
    industries: ['Tech', 'AI', 'Automation', 'Startups'],
    experienceLevel: ['Junior', 'Entry-Level', 'Mid-Level']
  }
};

export const calculateRelevanceScore = (job: Job): number => {
  let score = 0;
  let maxScore = 100;

  // Skills matching (40% of score)
  const skillScore = calculateSkillMatch(job.requirements, job.description);
  score += skillScore * 0.4;

  // Location preference (15% of score)
  const locationScore = calculateLocationScore(job);
  score += locationScore * 0.15;

  // Salary alignment (15% of score)
  const salaryScore = calculateSalaryScore(job.salary);
  score += salaryScore * 0.15;

  // Industry/company match (10% of score)
  const industryScore = calculateIndustryScore(job);
  score += industryScore * 0.1;

  // Experience level match (10% of score)
  const experienceScore = calculateExperienceScore(job);
  score += experienceScore * 0.1;

  // Recency bonus (10% of score)
  const recencyScore = calculateRecencyScore(job.postedDate);
  score += recencyScore * 0.1;

  return Math.round(Math.max(0, Math.min(100, score)));
};

function calculateSkillMatch(requirements: string[], description: string): number {
  const allSkills = [...JEREMY_PROFILE.skills.primary, ...JEREMY_PROFILE.skills.secondary, ...JEREMY_PROFILE.skills.emerging];
  const jobText = [...requirements, description].join(' ').toLowerCase();
  
  let matchScore = 0;
  let primaryMatches = 0;
  let secondaryMatches = 0;
  let emergingMatches = 0;

  // Check primary skills (highest weight)
  JEREMY_PROFILE.skills.primary.forEach(skill => {
    if (jobText.includes(skill.toLowerCase())) {
      matchScore += 20;
      primaryMatches++;
    }
  });

  // Check secondary skills (medium weight)
  JEREMY_PROFILE.skills.secondary.forEach(skill => {
    if (jobText.includes(skill.toLowerCase())) {
      matchScore += 10;
      secondaryMatches++;
    }
  });

  // Check emerging skills (lower weight but good for growth)
  JEREMY_PROFILE.skills.emerging.forEach(skill => {
    if (jobText.includes(skill.toLowerCase())) {
      matchScore += 15;
      emergingMatches++;
    }
  });

  // Bonus for having multiple skill matches
  const totalMatches = primaryMatches + secondaryMatches + emergingMatches;
  if (totalMatches >= 3) matchScore += 10;
  if (totalMatches >= 5) matchScore += 10;

  return Math.min(100, matchScore);
}

function calculateLocationScore(job: Job): number {
  if (job.isRemote) return 100 * JEREMY_PROFILE.preferences.remoteWeight;
  if (job.location.toLowerCase().includes('nashville')) return 95;
  if (job.location.toLowerCase().includes('tennessee') || job.location.toLowerCase().includes('tn')) return 85;
  return 50; // Other locations get lower score
}

function calculateSalaryScore(salaryString: string): number {
  const salaryNumbers = salaryString.match(/\d+,?\d*/g)?.map(s => parseInt(s.replace(',', ''))) || [0];
  const maxSalary = Math.max(...salaryNumbers);
  const minSalary = Math.min(...salaryNumbers);
  
  if (maxSalary >= JEREMY_PROFILE.preferences.salaryMin + 20000) return 100; // Well above minimum
  if (maxSalary >= JEREMY_PROFILE.preferences.salaryMin + 10000) return 90;  // Above minimum
  if (maxSalary >= JEREMY_PROFILE.preferences.salaryMin) return 80;          // At minimum
  if (maxSalary >= JEREMY_PROFILE.preferences.salaryMin - 5000) return 70;   // Slightly below
  return 50; // Significantly below preferences
}

function calculateIndustryScore(job: Job): number {
  const jobText = (job.company + ' ' + job.description + ' ' + job.tags.join(' ')).toLowerCase();
  
  let score = 50; // Base score
  
  // Check for preferred industries/keywords
  if (jobText.includes('tech') || jobText.includes('startup')) score += 20;
  if (jobText.includes('ai') || jobText.includes('machine learning') || jobText.includes('ml')) score += 25;
  if (jobText.includes('automation')) score += 30; // High preference for automation
  if (jobText.includes('remote') && job.isRemote) score += 15;
  
  // Bonus for innovative/modern companies
  if (jobText.includes('innovation') || jobText.includes('cutting-edge') || jobText.includes('modern')) score += 10;
  
  return Math.min(100, score);
}

function calculateExperienceScore(job: Job): number {
  const jobText = (job.title + ' ' + job.description).toLowerCase();
  
  // Look for experience level indicators
  if (jobText.includes('junior') || jobText.includes('entry') || jobText.includes('associate')) return 100;
  if (jobText.includes('mid') || jobText.includes('intermediate')) return 90;
  if (jobText.includes('senior') || jobText.includes('lead') || jobText.includes('principal')) return 60;
  if (jobText.includes('manager') || jobText.includes('director')) return 30;
  
  return 80; // Default good score if no clear indicators
}

function calculateRecencyScore(postedDate: string): number {
  const posted = new Date(postedDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) return 100;  // Posted today or yesterday
  if (daysDiff <= 3) return 90;   // Posted within 3 days
  if (daysDiff <= 7) return 80;   // Posted within a week
  if (daysDiff <= 14) return 70;  // Posted within 2 weeks
  if (daysDiff <= 30) return 60;  // Posted within a month
  return 40; // Older than a month
}