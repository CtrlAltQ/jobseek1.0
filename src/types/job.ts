export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: string;
  source: string;
  description: string;
  requirements: string[];
  isRemote: boolean;
  relevanceScore: number;
  applicationStatus: 'not_applied' | 'applied' | 'interview' | 'rejected';
  tags: string[];
  url: string;
}