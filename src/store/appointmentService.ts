import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore"
import { db } from "../firebase/firebase"

// Types
export interface Appointment {
  id?: string
  firstName: string
  lastName: string
  specialty: string
  date: string // format ISO "YYYY-MM-DD"
  doctor: string
  time: string // format "HH:mm"
  status: string // "pending", "confirmed", "cancelled", etc.
  patientId?: string // Optionnel, pour lier à un patient existant
  email?: string // Email du patient pour recherche
  phone?: string // Numéro de téléphone pour recherche
  createdAt?: any
  updatedAt?: any
}

export interface CreateAppointmentData {
  firstName: string
  lastName: string
  specialty: string
  date: string
  doctor: string
  time: string
  status: string
  patientId?: string
  email?: string
  phone?: string
}

/**
 * Crée un nouveau rendez-vous dans la base de données
 * @param appointmentData - Les données du rendez-vous à créer
 * @returns L'ID du rendez-vous créé
 */
export const createAppointment = async (
  appointmentData: CreateAppointmentData
): Promise<string> => {
  try {
    const newAppointmentData = {
      ...appointmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const appointmentRef = await addDoc(
      collection(db, "appointments"),
      newAppointmentData
    )
    return appointmentRef.id
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error)
    throw new Error("Impossible de créer le rendez-vous. Veuillez réessayer.")
  }
}

/**
 * Met à jour un rendez-vous existant
 * @param appointmentId - L'ID du rendez-vous à mettre à jour
 * @param appointmentData - Les nouvelles données du rendez-vous
 * @returns L'ID du rendez-vous mis à jour
 */
export const updateAppointment = async (
  appointmentId: string,
  appointmentData: Partial<CreateAppointmentData>
): Promise<string> => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId)
    const updatedData = {
      ...appointmentData,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(appointmentRef, updatedData)
    return appointmentId
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rendez-vous:", error)
    throw new Error(
      "Impossible de mettre à jour le rendez-vous. Veuillez réessayer."
    )
  }
}

/**
 * Récupère un rendez-vous par son ID
 * @param appointmentId - L'ID du rendez-vous à récupérer
 * @returns Le rendez-vous trouvé ou null si aucun rendez-vous n'est trouvé
 */
export const getAppointmentById = async (
  appointmentId: string
): Promise<Appointment | null> => {
  try {
    const appointmentDoc = await getDocs(
      query(
        collection(db, "appointments"),
        where("__name__", "==", appointmentId)
      )
    )

    if (!appointmentDoc.empty) {
      const appointment = appointmentDoc.docs[0]
      return {
        id: appointment.id,
        ...appointment.data(),
      } as Appointment
    }

    return null
  } catch (error) {
    console.error("Erreur lors de la récupération du rendez-vous:", error)
    throw new Error(
      "Impossible de récupérer le rendez-vous. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous (utile pour l'administration)
 * @returns Une liste de tous les rendez-vous
 */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(appointmentsRef, orderBy("date"), orderBy("time"))
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    throw new Error(
      "Impossible de récupérer la liste des rendez-vous. Veuillez réessayer."
    )
  }
}

/**
 * Annule un rendez-vous en modifiant son statut
 * @param appointmentId - L'ID du rendez-vous à annuler
 * @returns L'ID du rendez-vous annulé
 */
export const cancelAppointment = async (
  appointmentId: string
): Promise<string> => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId)
    await updateDoc(appointmentRef, {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    })
    return appointmentId
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous:", error)
    throw new Error("Impossible d'annuler le rendez-vous. Veuillez réessayer.")
  }
}

/**
 * Confirme un rendez-vous en modifiant son statut
 * @param appointmentId - L'ID du rendez-vous à confirmer
 * @returns L'ID du rendez-vous confirmé
 */
export const confirmAppointment = async (
  appointmentId: string
): Promise<string> => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId)
    await updateDoc(appointmentRef, {
      status: "confirmed",
      updatedAt: serverTimestamp(),
    })
    return appointmentId
  } catch (error) {
    console.error("Erreur lors de la confirmation du rendez-vous:", error)
    throw new Error(
      "Impossible de confirmer le rendez-vous. Veuillez réessayer."
    )
  }
}

/**
 * Supprime un rendez-vous de la base de données
 * @param appointmentId - L'ID du rendez-vous à supprimer
 */
export const deleteAppointment = async (
  appointmentId: string
): Promise<void> => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId)
    await deleteDoc(appointmentRef)
  } catch (error) {
    console.error("Erreur lors de la suppression du rendez-vous:", error)
    throw new Error(
      "Impossible de supprimer le rendez-vous. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous d'un patient par email
 * @param email - L'email du patient
 * @returns Une liste des rendez-vous du patient
 */
export const getAppointmentsByEmail = async (
  email: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("email", "==", email),
        orderBy("date"),
        orderBy("time")
      )
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous par email:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous pour cet email. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous d'un patient par numéro de téléphone
 * @param phone - Le numéro de téléphone du patient
 * @returns Une liste des rendez-vous du patient
 */
export const getAppointmentsByPhone = async (
  phone: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("phone", "==", phone),
        orderBy("date"),
        orderBy("time")
      )
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous par téléphone:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous pour ce numéro de téléphone. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous d'un patient par email ou phone
 * @param value - L'email ou le téléphone du patient
 * @returns Une liste des rendez-vous du patient
 */
export const getAppointmentsByEmailOrPhone = async (
  value: string
): Promise<Appointment[]> => {
  try {
    // Vérifie d'abord si c'est un email (contient @)
    if (value.includes("@")) {
      return getAppointmentsByEmail(value)
    } else {
      // Sinon considère comme numéro de téléphone
      return getAppointmentsByPhone(value)
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    throw new Error(
      "Impossible de récupérer les rendez-vous. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous d'un patient par nom
 * @param firstName - Le prénom du patient
 * @param lastName - Le nom du patient
 * @returns Une liste des rendez-vous du patient
 */
export const getAppointmentsByPatientName = async (
  firstName: string,
  lastName: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("firstName", "==", firstName),
        where("lastName", "==", lastName),
        orderBy("date"),
        orderBy("time")
      )
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous du patient:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous du patient. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous d'un patient par son ID
 * @param patientId - L'ID du patient
 * @returns Une liste des rendez-vous du patient
 */
export const getAppointmentsByPatientId = async (
  patientId: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("patientId", "==", patientId),
        orderBy("date"),
        orderBy("time")
      )
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous du patient:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous du patient. Veuillez réessayer."
    )
  }
}

/**
 * Vérifie si un créneau horaire est disponible
 * @param date - La date du rendez-vous (format ISO "YYYY-MM-DD")
 * @param time - L'heure du rendez-vous (format "HH:mm")
 * @param doctor - Le nom du médecin
 * @returns true si le créneau est disponible, false sinon
 */
export const isTimeSlotAvailable = async (
  date: string,
  time: string,
  doctor: string
): Promise<boolean> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("date", "==", date),
        where("time", "==", time),
        where("doctor", "==", doctor),
        where("status", "in", ["pending", "confirmed"])
      )
    )

    return querySnapshot.empty // Si la requête est vide, le créneau est disponible
  } catch (error) {
    console.error("Erreur lors de la vérification du créneau horaire:", error)
    throw new Error(
      "Impossible de vérifier la disponibilité. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous pour une date donnée
 * @param date - La date des rendez-vous à récupérer (format ISO "YYYY-MM-DD")
 * @returns Une liste des rendez-vous pour la date spécifiée
 */
export const getAppointmentsByDate = async (
  date: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(appointmentsRef, where("date", "==", date), orderBy("time"))
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous par date:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous pour cette date. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous pour un médecin donné
 * @param doctor - Le nom du médecin
 * @returns Une liste des rendez-vous pour le médecin spécifié
 */
export const getAppointmentsByDoctor = async (
  doctor: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("doctor", "==", doctor),
        orderBy("date"),
        orderBy("time")
      )
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous par médecin:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous pour ce médecin. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous pour une spécialité donnée
 * @param specialty - La spécialité médicale
 * @returns Une liste des rendez-vous pour la spécialité spécifiée
 */
export const getAppointmentsBySpecialty = async (
  specialty: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("specialty", "==", specialty),
        orderBy("date"),
        orderBy("time")
      )
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous par spécialité:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous pour cette spécialité. Veuillez réessayer."
    )
  }
}

/**
 * Récupère tous les rendez-vous à venir (date >= aujourd'hui)
 * @returns Une liste des rendez-vous à venir
 */
export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
  try {
    const today = new Date().toISOString().split("T")[0] // Format YYYY-MM-DD
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(
      query(
        appointmentsRef,
        where("date", ">=", today),
        where("status", "in", ["pending", "confirmed"]),
        orderBy("date"),
        orderBy("time")
      )
    )

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous à venir:",
      error
    )
    throw new Error(
      "Impossible de récupérer les rendez-vous à venir. Veuillez réessayer."
    )
  }
}
