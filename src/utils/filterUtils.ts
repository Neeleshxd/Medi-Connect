import { Doctor, FilterState } from '../types';

export const getUniqueSpecialties = (doctors: Doctor[]): string[] => {
  const specialtiesSet = new Set<string>();
  
  doctors?.forEach(doctor => {
    (doctor.specialty || []).forEach(specialty => {
      specialtiesSet.add(specialty);
    });
  });
  
  return Array.from(specialtiesSet).sort();
};

export const filterDoctors = (doctors: Doctor[], filters: FilterState): Doctor[] => {
  return doctors.filter(doctor => {
    // Filter by search term
    if (filters.search && !doctor.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by consultation type
    if (filters.consultationType && 
        !(doctor.consultationMode ?? []).includes(filters.consultationType)) {
      return false;
    }
    
    // Filter by specialties
    if (filters.specialties.length > 0) {
      const hasSelectedSpecialty = (doctor.specialty || []).some(s => 
        filters.specialties.includes(s)
      );
      
      if (!hasSelectedSpecialty) {
        return false;
      }
    }
    
    return true;
  });
};

export const sortDoctors = (doctors: Doctor[], sortBy: string): Doctor[] => {
  const sortedDoctors = [...doctors];
  
  switch (sortBy) {
    case 'fees':
      return sortedDoctors.sort((a, b) => (a.fee ?? 0) - (b.fee ?? 0));
    case 'experience':
      return sortedDoctors.sort((a, b) => b.experience - a.experience);
    default:
      return sortedDoctors;
  }
};

export const getFilteredDoctors = (doctors: Doctor[], filters: FilterState): Doctor[] => {
  const filtered = filterDoctors(doctors, filters);
  return sortDoctors(filtered, filters.sortBy);
};

export const searchSuggestions = (doctors: Doctor[], searchTerm: string): string[] => {
  if (!searchTerm) return [];
  
  const term = searchTerm.toLowerCase();
  const matches = doctors
    .filter(doctor => doctor.name.toLowerCase().includes(term))
    .map(doctor => doctor.name)
    .slice(0, 3);
  
  return matches;
};