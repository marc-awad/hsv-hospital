// services/doctorsService.ts
import { db } from "../firebase/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export interface Doctor {
  id: string
  name: string
  specialty: string
  firstName?: string
  lastName?: string
}

export const fetchAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const snapshot = await getDocs(collection(db, "doctors"))

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name:
          data.name ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
          "Nom non disponible",
        specialty: data.specialty || data.specialtyId || "",
        firstName: data.firstName,
        lastName: data.lastName,
      } as Doctor
    })
  } catch (error) {
    console.error("Erreur lors du chargement des médecins:", error)
    throw new Error(
      "Erreur lors du chargement des médecins. Veuillez réessayer."
    )
  }
}

export const fetchDoctorsBySpecialty = async (
  specialtyId: string
): Promise<Doctor[]> => {
  if (!specialtyId) return []

  try {
    const q = query(
      collection(db, "doctors"),
      where("specialty", "==", specialtyId)
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name:
          data.name ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
          "Nom non disponible",
        specialty: data.specialty || data.specialtyId || "",
        firstName: data.firstName,
        lastName: data.lastName,
      } as Doctor
    })
  } catch (error) {
    console.error(
      "Erreur lors du chargement des médecins pour cette spécialité:",
      error
    )
    throw new Error("Erreur lors du chargement des médecins.")
  }
}
