import React, { forwardRef, useImperativeHandle, useState } from 'react';

const SearchBar = forwardRef(({ onSearch, initialValue = '' }, ref) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  // Expose clearSearch method via ref
  useImperativeHandle(ref, () => ({
    clearSearch() {
      setInputValue('');
    },
  }));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      setIsSearching(true);
      onSearch(inputValue.trim());
      setTimeout(() => setIsSearching(false), 500); // Simulate loading delay
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch(''); // Trigger search with empty value to reset
  };

  return (
    <div className="flex items-center mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search jobs by title, company, or keyword..."
          className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:placeholder-gray-400"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search jobs"
          disabled={isSearching}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        disabled={isSearching || !inputValue.trim()}
        className={`px-4 py-2 rounded-r-md text-white transition ${
          isSearching || !inputValue.trim()
            ? 'bg-blue-400 cursor-not-allowed dark:bg-blue-500'
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
        }`}
        aria-label="Search"
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
});

export default SearchBar;