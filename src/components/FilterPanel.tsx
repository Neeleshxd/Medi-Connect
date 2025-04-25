import React, { useState } from 'react';
import { FilterState } from '../types';
import { ChevronDown, Search } from 'lucide-react';

interface FilterPanelProps {
  filterState: FilterState;
  specialties: string[];
  updateFilter: (key: keyof FilterState, value: any) => void;
  toggleSpecialty: (specialty: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterState,
  specialties,
  updateFilter,
  toggleSpecialty,
}) => {
  const { consultationType, sortBy } = filterState;
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [isSpecialtiesExpanded, setIsSpecialtiesExpanded] = useState(true);

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );
  console.log(specialties);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            className="text-blue-600 text-sm hover:text-blue-800"
            onClick={() => {
              updateFilter('consultationType', '');
              updateFilter('specialties', []);
              updateFilter('sortBy', '');
              setSpecialtySearch('');
            }}
          >
            Clear All
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div 
            className="flex justify-between items-center cursor-pointer mb-3"
            onClick={() => setIsSpecialtiesExpanded(!isSpecialtiesExpanded)}
          >
            <h3 
              data-testid="filter-header-speciality" 
              className="text-base font-medium text-gray-800"
            >
              Specialities
            </h3>
            <ChevronDown 
              className={`h-5 w-5 text-gray-500 transition-transform ${
                isSpecialtiesExpanded ? 'transform rotate-180' : ''
              }`}
            />
          </div>

          {isSpecialtiesExpanded && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search specialities"
                  value={specialtySearch}
                  onChange={(e) => setSpecialtySearch(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredSpecialties.map((specialty) => (
                  <label 
                    key={specialty} 
                    className="flex items-center space-x-2 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      data-testid={`filter-specialty-${specialty.toLowerCase().replace(/\s+/g, '')}`}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={filterState.specialties.includes(specialty)}
                      onChange={() => toggleSpecialty(specialty)}
                    />
                    <span className="text-sm text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="mb-3">
            <h3 
              data-testid="filter-header-moc" 
              className="text-base font-medium text-gray-800 mb-3"
            >
              Consultation Type
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  data-testid="filter-video-consult"
                  name="consultationType"
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={consultationType === 'Video Consult'}
                  onChange={() => updateFilter('consultationType', 'Video Consult')}
                />
                <span className="text-sm text-gray-700">Video Consult</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  data-testid="filter-in-clinic"
                  name="consultationType"
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={consultationType === 'In Clinic'}
                  onChange={() => updateFilter('consultationType', 'In Clinic')}
                />
                <span className="text-sm text-gray-700">In Clinic</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 
            data-testid="filter-header-sort" 
            className="text-base font-medium text-gray-800 mb-3"
          >
            Sort By
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                data-testid="sort-fees"
                name="sortBy"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={sortBy === 'fees'}
                onChange={() => updateFilter('sortBy', 'fees')}
              />
              <span className="text-sm text-gray-700">Fees (Low to High)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                data-testid="sort-experience"
                name="sortBy"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={sortBy === 'experience'}
                onChange={() => updateFilter('sortBy', 'experience')}
              />
              <span className="text-sm text-gray-700">Experience (High to Low)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
