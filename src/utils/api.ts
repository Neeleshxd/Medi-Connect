import type { Doctor } from "../types"

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json"

const doctorImages = [
  "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg",
  "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg",
  "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg",
  "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg",
  "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg",
  "https://images.pexels.com/photos/5407214/pexels-photo-5407214.jpeg",
  "https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg",
  "https://images.pexels.com/photos/5726794/pexels-photo-5726794.jpeg",
  "https://images.pexels.com/photos/5726723/pexels-photo-5726723.jpeg",
  "https://images.pexels.com/photos/5726812/pexels-photo-5726812.jpeg",
]

const generateConsultationFee = (experience: number): number => {
  const baseRate = 500
  const experienceMultiplier = 100
  return Math.round((baseRate + experience * experienceMultiplier) / 100) * 100
}

// Update the fetchDoctors function to ensure specialties are properly set
export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error("Failed to fetch doctors")
    }
    const data: any[] = await response.json()

    // Define common specialties for doctors
    const commonSpecialties = [
      "General Physician",
      "Cardiologist",
      "Neurologist",
      "Dermatologist",
      "Pediatrician",
      "Orthopedic",
      "Gynecologist",
      "Oncologist",
      "Ophthalmologist",
      "ENT Specialist",
    ]

    return data.map((doctorData, index) => {
      // Ensure specialty is properly set
      let specialty: string[]

      if (Array.isArray(doctorData.specialty) && doctorData.specialty.length > 0) {
        specialty = doctorData.specialty
      } else if (typeof doctorData.specialty === "string" && doctorData.specialty) {
        specialty = [doctorData.specialty]
      } else {
        // Assign a default specialty if none exists
        specialty = [commonSpecialties[index % commonSpecialties.length]]
      }

      // Normalize the fee field
      const fee =
        doctorData.fee ??
        Number.parseFloat(doctorData.fees?.replace(/[^\d.-]/g, "") || "") ??
        generateConsultationFee(Number(doctorData.experience) || 1)

      // Map raw doctor data to fit the Doctor interface
      const doctor: Doctor = {
        id: doctorData.id ?? String(index), // Use index as fallback if id is not present
        name: doctorData.name || "Unknown",
        image: doctorImages[index % doctorImages.length],
        specialty, // Now properly set
        qualifications: doctorData.qualifications || [
          "MBBS",
          `MD - ${specialty[0] || "General Medicine"}`,
          `${Math.floor(Math.random() * 5) + 1} years residency`,
        ],
        experience: doctorData.experience || Math.floor(Math.random() * 20) + 5,
        clinic: doctorData.clinic || `${specialty[0]} Clinic`,
        location:
          doctorData.location || ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"][Math.floor(Math.random() * 5)],
        consultationMode:
          doctorData.consultationMode ||
          [
            Math.random() > 0.5 ? "Video Consult" : "In Clinic",
            Math.random() > 0.7 ? (Math.random() > 0.5 ? "Video Consult" : "In Clinic") : "",
          ].filter(Boolean),
        fee,
      }

      return doctor
    })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return []
  }
}
