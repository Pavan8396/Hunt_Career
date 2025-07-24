import React, { useEffect, useRef, useState, useMemo } from 'react';
import JobCard from '../components/JobCard';
import SkeletonCard from '../components/SkeletonCard';
import { fetchJobs } from '../services/api';
import SearchBar from '../components/SearchBar';
import { toast } from 'react-toastify';

const JOBS_PER_PAGE = 6;
const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsList, setLocationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [jobTypeSearch, setJobTypeSearch] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const locationRef = useRef();
  const jobTypeRef = useRef();
  const searchBarRef = useRef();

  const extractLocations = (data) => {
    const unique = Array.from(
      new Set(
        data
          .map((job) => {
            const loc = (job.candidate_required_location || '').trim();
            return loc ? loc : null;
          })
          .filter(Boolean)
      )
    ).sort();
    if (unique.length === 0) {
      unique.push('Bengaluru, Karnataka, India', 'New York, NY, USA', 'Remote');
    }
    setLocationsList(unique);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const allJobs = await fetchJobs();
        if (!allJobs || allJobs.length === 0) {
          setLocationsList(['Bengaluru, Karnataka, India', 'New York, NY, USA', 'Remote']);
        } else {
          extractLocations(allJobs);
        }
      } catch (error) {
        setError('Failed to load initial job data. Using fallback locations.');
        setLocationsList(['Bengaluru, Karnataka, India', 'New York, NY, USA', 'Remote']);
      }
    };
    fetchInitialData();
  }, []);

  const loadJobs = async (search = searchTerm) => {
    setIsLoading(true);
    setError(null);
    const startTime = Date.now();
    try {
      const jobData = await fetchJobs(search.trim(), location.map(loc => loc), jobType);
      setJobs(jobData || []); // Ensure jobData is an array, even if empty
    } catch (error) {
      setError(`Failed to load jobs: ${error.message}. Please ensure the backend server is running and try again.`);
      setJobs([]);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 500 - elapsedTime;
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    setCurrentPage(1);
  }, [location, jobType, searchTerm]);

  const handleSearchSubmit = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    loadJobs(newSearchTerm);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation([]);
    setJobType([]);
    setSortOption('default');
    setCurrentPage(1);
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch();
    }
    loadJobs('');
  };

  const handleClickOutside = (event) => {
    if (locationRef.current && !locationRef.current.contains(event.target)) {
      setShowLocationDropdown(false);
    }
    if (jobTypeRef.current && !jobTypeRef.current.contains(event.target)) {
      setShowJobTypeDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayText = (items) => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    return `${items[0]}+${items.length - 1}`;
  };

  const filteredLocations = locationsList.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredJobTypes = jobTypes.filter((type) =>
    type.toLowerCase().includes(jobTypeSearch.toLowerCase())
  );

  const sortedJobs = useMemo(() => {
    const sorted = [...jobs];
    switch (sortOption) {
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'company-asc':
        return sorted.sort((a, b) => a.company.localeCompare(b.company));
      default:
        return sorted;
    }
  }, [jobs, sortOption]);

  const currentJobs = useMemo(() => {
    const indexOfLast = currentPage * JOBS_PER_PAGE;
    const indexOfFirst = indexOfLast - JOBS_PER_PAGE;
    return sortedJobs.slice(indexOfFirst, indexOfLast);
  }, [sortedJobs, currentPage]);

  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {error && <p className="text-red-500 text-center mb-4 dark:text-red-400">{error}</p>}

      <SearchBar ref={searchBarRef} onSearch={handleSearchSubmit} initialValue={searchTerm} />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative" ref={locationRef}>
            <button
              onClick={() => setShowLocationDropdown((prev) => !prev)}
              className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-100 transition dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-200"
              aria-label="Toggle location filter dropdown"
            >
              Location
              <span>{showLocationDropdown ? '▲' : '▼'}</span>
            </button>
            {showLocationDropdown && (
              <div className="absolute bg-white shadow-md border rounded mt-2 w-56 z-10 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2 border-b dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    aria-label="Search locations"
                  />
                </div>
                <div className="p-2 max-h-60 overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No locations found</p>
                  ) : (
                    filteredLocations.map((loc) => (
                      <label key={loc} className="block text-gray-900 dark:text-gray-200">
                        <input
                          type="checkbox"
                          value={loc}
                          checked={location.includes(loc)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setLocation((prev) =>
                              prev.includes(value)
                                ? prev.filter((item) => item !== value)
                                : [...prev, value]
                            );
                          }}
                          className="mr-2"
                          aria-label={`Select location ${loc}`}
                        />
                        {loc}
                      </label>
                    ))
                  )}
                </div>
                <div className="p-2 border-t text-right dark:border-gray-700">
                  <button
                    onClick={() => setLocation([])}
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                    aria-label="Clear all location filters"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={jobTypeRef}>
            <button
              onClick={() => setShowJobTypeDropdown((prev) => !prev)}
              className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-100 transition dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-200"
              aria-label="Toggle job type filter dropdown"
            >
              Job Type
              <span>{showJobTypeDropdown ? '▲' : '▼'}</span>
            </button>
            {showJobTypeDropdown && (
              <div className="absolute bg-white shadow-md border rounded mt-2 w-56 z-10 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-2 border-b dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Search job type..."
                    className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    value={jobTypeSearch}
                    onChange={(e) => setJobTypeSearch(e.target.value)}
                    aria-label="Search job types"
                  />
                </div>
                <div className="p-2 max-h-60 overflow-y-auto">
                  {filteredJobTypes.map((type) => (
                    <label key={type} className="block text-gray-900 dark:text-gray-200">
                      <input
                        type="checkbox"
                        value={type}
                        checked={jobType.includes(type)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setJobType((prev) =>
                            prev.includes(value)
                              ? prev.filter((item) => item !== value)
                              : [...prev, value]
                          );
                        }}
                        className="mr-2"
                        aria-label={`Select job type ${type}`}
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div className="p-2 border-t text-right dark:border-gray-700">
                  <button
                    onClick={() => setJobType([])}
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                    aria-label="Clear all job type filters"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              aria-label="Sort jobs"
            >
              <option value="default">Sort By: Default</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="company-asc">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {(searchTerm || location.length > 0 || jobType.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {searchTerm && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 dark:bg-blue-900 dark:text-blue-300">
              🔍 {searchTerm}
              <button
                onClick={() => {
                  setSearchTerm('');
                  if (searchBarRef.current) {
                    searchBarRef.current.clearSearch();
                  }
                  loadJobs('');
                }}
                className="font-bold hover:text-red-500 dark:hover:text-red-400"
                aria-label="Clear search term filter"
              >
                ×
              </button>
            </span>
          )}
          {location.length > 0 && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2 dark:bg-green-900 dark:text-green-300">
              📍 {getDisplayText(location)}
              <button
                onClick={() => setLocation([])}
                className="font-bold hover:text-red-500 dark:hover:text-red-400"
                aria-label="Clear all location filters"
              >
                ×
              </button>
            </span>
          )}
          {jobType.length > 0 && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-2 dark:bg-purple-900 dark:text-purple-300">
              🧾 {getDisplayText(jobType)}
              <button
                onClick={() => setJobType([])}
                className="font-bold hover:text-red-500 dark:hover:text-red-400"
                aria-label="Clear all job type filters"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading && (
          <>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </>
        )}
        {!isLoading && currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <JobCard
              key={job._id}
              id={job._id}
              {...job}
              onSave={() => {
                showNotification(`Job "${job.title}" saved!`);
                toast.success(`Job "${job.title}" saved!`);
              }}
              onUnsave={() => {
                showNotification(`Job "${job.title}" unsaved!`);
                toast.info(`Job "${job.title}" unsaved!`);
              }}
            />
          ))
        ) : (
          !isLoading && <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No jobs found.</p>
        )}
      </div>

      {notification.message && (
        <div className="mt-4 text-center">
          <p
            className={`px-4 py-2 rounded ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <>
          <p className="text-center mb-2 dark:text-gray-100">Page {currentPage} of {totalPages}</p>
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white transition dark:bg-gray-700 dark:border-gray-500 dark:hover:bg-blue-700 dark:text-white"
              aria-label="Previous page"
            >
              ◀ Prev
            </button>
            {(() => {
              const maxPages = 5;
              let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
              let end = start + maxPages - 1;
              if (end > totalPages) {
                end = totalPages;
                start = Math.max(1, end - maxPages + 1);
              }
              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-600 text-white' : ''
                      } hover:bg-blue-100 transition dark:bg-gray-700 dark:border-gray-500 dark:hover:bg-blue-700 dark:text-white ${currentPage === page ? 'dark:bg-blue-700' : ''}`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                )
              );
            })()}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white transition dark:bg-gray-700 dark:border-gray-500 dark:hover:bg-blue-700 dark:text-white"
              aria-label="Next page"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;