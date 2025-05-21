// services/specialtiesService.ts
import { db } from "../firebase/firebase"
import { collection, getDocs } from "firebase/firestore"

export interface Specialty {
  id: string
  name: string
}

export interface SelectOption {
  label: string
  value: string
}

export const fetchSpecialties = async (): Promise<SelectOption[]> => {
  try {
    const snapshot = await getDocs(collection(db, "specialties"))

    return snapshot.docs
      .map((doc) => {
        const data = doc.data() as Specialty
        return {
          label: data.name || "Unknown",
          value: doc.id,
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  } catch (error) {
    console.error("Erreur lors du chargement des spécialités:", error)
    throw new Error(
      "Erreur lors du chargement des spécialités. Veuillez réessayer."
    )
  }
}
