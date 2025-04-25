import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Doctor } from '../types';

interface SearchBarProps {
  doctors: Doctor[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectSuggestion: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  doctors, 
  searchTerm, 
  onSearchChange, 
  onSelectSuggestion 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filteredSuggestions = doctors
        .filter(doctor => 
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(doctor => doctor.name)
        .slice(0, 3);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, doctors]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm) {
      setShowSuggestions(false);
      onSearchChange(searchTerm);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSelectSuggestion(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          data-testid="autocomplete-input"
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for doctors by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                data-testid="suggestion-item"
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;