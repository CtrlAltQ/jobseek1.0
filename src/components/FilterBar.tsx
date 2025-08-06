'use client'

import { useState } from 'react';

interface FilterBarProps {
  onSearch: (term: string) => void;
  onLocationFilter: (location: string) => void;
  onSalaryFilter: (min: number, max: number) => void;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
  jobCount: number;
}

export default function FilterBar({ 
  onSearch, 
  onLocationFilter, 
  onSalaryFilter, 
  onSortChange, 
  onClearFilters,
  jobCount 
}: FilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocation(value);
    onLocationFilter(value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange(value);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setLocation('all');
    setSortBy('relevance');
    onClearFilters();
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm bg-gray-800/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main search and controls row */}
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search jobs, companies, or skills..."
              className="w-full pl-10 pr-4 py-3 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm transition-all-smooth"
            />
          </div>

          {/* Quick filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <select
                value={location}
                onChange={handleLocationChange}
                className="px-3 py-3 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm transition-all-smooth flex-1 sm:flex-none sm:min-w-0"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote Only</option>
                <option value="nashville">Nashville Area</option>
                <option value="both">Remote + Nashville</option>
              </select>

              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-3 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm transition-all-smooth flex-1 sm:flex-none sm:min-w-0"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="date">Sort by Date</option>
                <option value="salary">Sort by Salary</option>
                <option value="company">Sort by Company</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 transition-all-smooth text-base sm:text-sm flex items-center justify-center gap-2 flex-1 sm:flex-none ${showFilters ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' : ''}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span className="sm:inline">Filters</span>
              </button>

              {(searchTerm || location !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-3 sm:py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all-smooth text-base sm:text-sm flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Advanced filters (collapsible) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Type
                </label>
                <div className="space-y-2">
                  {['remote', 'frontend', 'fullstack', 'react', 'python'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                      />
                      <span className="ml-2 text-sm text-gray-300 capitalize">{type.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience Level
                </label>
                <div className="space-y-2">
                  {['entry-level', 'junior', 'mid-level', 'senior'].map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                      />
                      <span className="ml-2 text-sm text-gray-300 capitalize">{level.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Salary Range
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="40000"
                    max="150000"
                    step="5000"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>$40k</span>
                    <span>$150k+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-300">
              {jobCount} job{jobCount !== 1 ? 's' : ''} found
            </span>
            {searchTerm && (
              <span className="text-blue-300">
                for "{searchTerm}"
              </span>
            )}
            {location !== 'all' && (
              <span className="text-green-300">
                in {location === 'nashville' ? 'Nashville Area' : location}
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Live data</span>
            </div>
            <span className="hidden sm:inline">Relevance Score: 70%+ recommended</span>
          </div>
        </div>
      </div>
    </div>
  );
}