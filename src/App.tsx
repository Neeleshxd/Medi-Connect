import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Doctor, FilterState } from './types';
import { fetchDoctors } from './utils/api';
import { getUniqueSpecialties, getFilteredDoctors } from './utils/filterUtils';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import DoctorsList from './components/DoctorsList';
import { Stethoscope } from 'lucide-react';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Initialize filter state from URL params
  const [filterState, setFilterState] = useState<FilterState>({
    search: searchParams.get('search') || '',
    consultationType: searchParams.get('consultationType') || '',
    specialties: searchParams.get('specialties') ? searchParams.get('specialties')!.split(',') : [],
    sortBy: searchParams.get('sortBy') || '',
  });

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      const data = await fetchDoctors();
      // Add placeholder data for the UI elements we need
      const enhancedData = data.map(doctor => ({
        ...doctor,
        // Remove 'Dr.' prefix if it exists in the name
        name: doctor.name.replace(/^Dr\.\s*/i, ''),
        consultationMode: [
          Math.random() > 0.5 ? 'Video Consult' : 'In Clinic',
          Math.random() > 0.7 ? (Math.random() > 0.5 ? 'Video Consult' : 'In Clinic') : ''
        ].filter(Boolean),
        location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)],
        qualifications: [`MBBS`, `MD - ${doctor.specialty?.[0] || 'Unknown'}`, `${Math.floor(Math.random() * 5) + 1} years residency`]
      }));
      setDoctors(enhancedData);
      setLoading(false);
    };
    
    loadDoctors();
  }, []);
  
  // Get all unique specialties from doctors
  const specialties = useMemo(() => {
    return getUniqueSpecialties(doctors);
  }, [doctors]);
  
  // Filter and sort doctors based on current filter state
  const filteredDoctors = useMemo(() => {
    return getFilteredDoctors(doctors, filterState);
  }, [doctors, filterState]);
  
  // Update filter state and URL params
  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilterState = { ...filterState, [key]: value };
    setFilterState(newFilterState);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    
    if (newFilterState.search) newSearchParams.set('search', newFilterState.search);
    if (newFilterState.consultationType) newSearchParams.set('consultationType', newFilterState.consultationType);
    if (newFilterState.specialties.length > 0) newSearchParams.set('specialties', newFilterState.specialties.join(','));
    if (newFilterState.sortBy) newSearchParams.set('sortBy', newFilterState.sortBy);
    
    setSearchParams(newSearchParams);
  };
  
  // Toggle specialty selection
  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = [...filterState.specialties];
    
    if (newSpecialties.includes(specialty)) {
      // Remove specialty
      const index = newSpecialties.indexOf(specialty);
      newSpecialties.splice(index, 1);
    } else {
      // Add specialty
      newSpecialties.push(specialty);
    }
    
    updateFilter('specialties', newSpecialties);
  };
  
  // Handle search term changes
  const handleSearchChange = (value: string) => {
    updateFilter('search', value);
  };
  
  // Handle selection of a suggestion
  const handleSelectSuggestion = (value: string) => {
    updateFilter('search', value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-white" />
              <h1 className="ml-2 text-2xl font-bold text-white">MediConnect</h1>
            </div>
          </div>
          
          <div className="mt-4 pb-6">
            <SearchBar
              doctors={doctors}
              searchTerm={filterState.search}
              onSearchChange={handleSearchChange}
              onSelectSuggestion={handleSelectSuggestion}
            />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Filter Panel - Sidebar */}
          <div className="md:w-1/4 mb-6 md:mb-0">
            <FilterPanel
              filterState={filterState}
              specialties={specialties}
              updateFilter={updateFilter}
              toggleSpecialty={toggleSpecialty}
            />
          </div>
          
          {/* Doctor List */}
          <div className="md:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {loading ? 'Loading doctors...' : `${filteredDoctors.length} doctors found`}
              </h2>
            </div>
            
            <DoctorsList doctors={filteredDoctors} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;