import { NextResponse } from 'next/server';
import { mockJobs } from '@/lib/mockJobs';
import { filterJobs } from '@/lib/jobUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const searchTerm = searchParams.get('search') || '';
  const location = searchParams.get('location') || 'all';
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // Filter jobs based on parameters
    const filteredJobs = filterJobs(
      mockJobs,
      searchTerm,
      location,
      0,
      200000,
      [],
      sortBy
    );

    // Paginate results
    const paginatedJobs = filteredJobs.slice(offset, offset + limit);
    
    return NextResponse.json({
      jobs: paginatedJobs,
      total: filteredJobs.length,
      offset,
      limit,
      hasMore: offset + limit < filteredJobs.length
    });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}