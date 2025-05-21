import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore"
import { db } from "../firebase/firebase"

// Types
export interface Patient {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt?: any
  updatedAt?: any
}

export interface CreatePatientData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

/**
 * Recherche un patient existant par email
 * @param email - L'email du patient à rechercher
 * @returns Le patient trouvé ou null si aucun patient n'est trouvé
 */
export const findExistingPatient = async (
  email: string
): Promise<Patient | null> => {
  try {
    const patientsRef = collection(db, "patients")
    const q = query(patientsRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const patientDoc = querySnapshot.docs[0]
      return {
        id: patientDoc.id,
        ...patientDoc.data(),
      } as Patient
    }

    return null
  } catch (error) {
    console.error("Erreur lors de la recherche du patient:", error)
    throw new Error("Impossible de rechercher le patient. Veuillez réessayer.")
  }
}

/**
 * Crée un nouveau patient dans la base de données
 * @param patientData - Les données du patient à créer
 * @returns L'ID du patient créé
 */
export const createPatient = async (
  patientData: CreatePatientData
): Promise<string> => {
  try {
    const newPatientData = {
      ...patientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const patientRef = await addDoc(collection(db, "patients"), newPatientData)
    return patientRef.id
  } catch (error) {
    console.error("Erreur lors de la création du patient:", error)
    throw new Error("Impossible de créer le patient. Veuillez réessayer.")
  }
}

/**
 * Met à jour un patient existant
 * @param patientId - L'ID du patient à mettre à jour
 * @param patientData - Les nouvelles données du patient
 * @returns L'ID du patient mis à jour
 */
export const updatePatient = async (
  patientId: string,
  patientData: CreatePatientData
): Promise<string> => {
  try {
    const patientRef = doc(db, "patients", patientId)
    const updatedData = {
      ...patientData,
      updatedAt: serverTimestamp(),
    }

    await setDoc(patientRef, updatedData, { merge: true })
    return patientId
  } catch (error) {
    console.error("Erreur lors de la mise à jour du patient:", error)
    throw new Error(
      "Impossible de mettre à jour le patient. Veuillez réessayer."
    )
  }
}

/**
 * Crée un nouveau patient ou met à jour un patient existant
 * @param patientData - Les données du patient
 * @returns L'ID du patient (nouveau ou existant)
 */
export const createOrUpdatePatient = async (
  patientData: CreatePatientData
): Promise<string> => {
  try {
    // Vérifier si le patient existe déjà
    const existingPatient = await findExistingPatient(patientData.email)

    if (existingPatient) {
      // Mettre à jour le patient existant
      return await updatePatient(existingPatient.id!, patientData)
    } else {
      // Créer un nouveau patient
      return await createPatient(patientData)
    }
  } catch (error) {
    console.error("Erreur lors de la gestion du patient:", error)
    throw error // Re-lancer l'erreur pour qu'elle soit gérée par le composant appelant
  }
}

/**
 * Récupère un patient par son ID
 * @param patientId - L'ID du patient à récupérer
 * @returns Le patient trouvé ou null si aucun patient n'est trouvé
 */
export const getPatientById = async (
  patientId: string
): Promise<Patient | null> => {
  try {
    const patientRef = doc(db, "patients", patientId)
    const patientDoc = await getDocs(
      query(collection(db, "patients"), where("__name__", "==", patientId))
    )

    if (!patientDoc.empty) {
      const patient = patientDoc.docs[0]
      return {
        id: patient.id,
        ...patient.data(),
      } as Patient
    }

    return null
  } catch (error) {
    console.error("Erreur lors de la récupération du patient:", error)
    throw new Error("Impossible de récupérer le patient. Veuillez réessayer.")
  }
}

/**
 * Récupère tous les patients (utile pour l'administration)
 * @returns Une liste de tous les patients
 */
export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const patientsRef = collection(db, "patients")
    const querySnapshot = await getDocs(patientsRef)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[]
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error)
    throw new Error(
      "Impossible de récupérer la liste des patients. Veuillez réessayer."
    )
  }
}
