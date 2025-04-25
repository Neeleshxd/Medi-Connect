import React from 'react';
import { Doctor } from '../types';
import { MapPin, Award } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const defaultImage = "https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg";

  // Log the doctor object and its fee to debug
  console.log('Doctor Object:', doctor);
  console.log('Doctor Fee:', doctor.fee);

  // Ensure the fee is a valid number by cleaning the '₹' symbol and handling invalid or missing fees
  const validFee = doctor.fee && !isNaN(Number(doctor.fee)) 
    ? parseFloat(String(doctor.fee).replace(/[^\d.-]/g, '')) // Ensure fee is a string before calling replace
    : 0;

  console.log('Valid Fee:', validFee); // Log the valid fee after conversion

  return (
    <div 
      data-testid="doctor-card" 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4"
    >
      <div className="p-4 md:p-6 flex flex-col md:flex-row">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img 
            src={doctor.image || defaultImage} 
            alt={`Dr. ${doctor.name}`}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-blue-100"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              {/* Doctor Name */}
              <h2 
                data-testid="doctor-name" 
                className="text-xl font-bold text-gray-800 mb-1"
              >
                Dr. {doctor.name}
              </h2>

              {/* Display Qualifications / Diplomas */}
              {(doctor.qualifications && doctor.qualifications.length > 0) && (
                <div className="text-sm text-gray-600 mb-1">
                  {doctor.qualifications.join(', ')}
                </div>
              )}
              
              {/* Display Specialties */}
              {(doctor.specialty && doctor.specialty.length > 0) && (
                <div className="mb-2">
                  <span 
                    data-testid="doctor-specialty" 
                    className="text-gray-600 text-sm"
                  >
                    {doctor.specialty.join(', ')}
                  </span>
                </div>
              )}
              
              {/* Display Experience */}
              {doctor.experience && (
                <div className="flex items-center mb-2">
                  <Award className="h-4 w-4 text-blue-600 mr-1" />
                  <span 
                    data-testid="doctor-experience" 
                    className="text-gray-700 text-sm"
                  >
                    {doctor.experience} years experience
                  </span>
                </div>
              )}
              
              {/* Display Location */}
              {doctor.location && (
                <div className="flex items-center mb-3">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-600 text-sm">{doctor.location}</span>
                </div>
              )}
              
              {/* Display Consultation Modes */}
              {doctor.consultationMode && doctor.consultationMode.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {doctor.consultationMode.map((mode, index) => (
                      <span 
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${
                          mode === 'Video Consult' 
                            ? 'bg-teal-100 text-teal-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Side */}
            <div className="mt-3 md:mt-0 md:ml-4 md:text-right">
              <div 
                data-testid="doctor-fee" 
                className="text-lg font-bold text-gray-900"
              >
                {validFee > 0 ? `₹${validFee.toFixed(2)}` : 'Fee not available'}
              </div>
              <div className="text-xs text-gray-500 mb-3">Consultation Fee</div>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
