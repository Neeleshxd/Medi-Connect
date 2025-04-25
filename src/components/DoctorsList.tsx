import React from 'react';
import { Doctor } from '../types';
import DoctorCard from './DoctorCard';

interface DoctorsListProps {
  doctors: Doctor[];
  loading: boolean;
}

const DoctorsList: React.FC<DoctorsListProps> = ({ doctors, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">No doctors found</h3>
        <p className="text-gray-600">
          Try adjusting your search or filter criteria to find more doctors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorsList;