import { Doctor } from '../types';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

const doctorImages = [
  'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
  'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg',
  'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
  'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg',
  'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
  'https://images.pexels.com/photos/5407214/pexels-photo-5407214.jpeg',
  'https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg',
  'https://images.pexels.com/photos/5726794/pexels-photo-5726794.jpeg',
  'https://images.pexels.com/photos/5726723/pexels-photo-5726723.jpeg',
  'https://images.pexels.com/photos/5726812/pexels-photo-5726812.jpeg'
];

const generateConsultationFee = (experience: number): number => {
  const baseRate = 500;
  const experienceMultiplier = 100;
  return Math.round((baseRate + (experience * experienceMultiplier)) / 100) * 100;
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }
    const data: any[] = await response.json(); // Adjust this to be more specific if you know the structure

    return data.map((doctorData, index) => {
      // Map the raw doctor data to fit the Doctor interface
      const doctor: Doctor = {
        id: doctorData.id ?? String(index), // Use index as fallback for unique ID if not present
        name: doctorData.name || 'Unknown', // Default values in case some fields are missing
        image: doctorImages[index % doctorImages.length],
        specialty: doctorData.specialty || [],
        qualifications: doctorData.qualifications || [],
        experience: doctorData.experience || 0,
        clinic: doctorData.clinic || '',
        location: doctorData.location || '',
        consultationMode: doctorData.consultationMode || [],
        fee: doctorData.fee ??
             parseFloat(doctorData.fees?.replace(/[^\d.-]/g, '') || '') ??
             generateConsultationFee(Number(doctorData.experience) || 1),
      };

      return doctor;
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};
