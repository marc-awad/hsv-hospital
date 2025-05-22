import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
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
  date: string // ISO format "YYYY-MM-DD"
  doctor: string
  time: string // format "HH:mm"
  status: string // "pending", "confirmed", "cancelled", etc.
  patientId?: string // Optional, to link to an existing patient
  email?: string // Patient email for search
  phone?: string // Phone number for search
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
 * Creates a new appointment in the database
 * @param appointmentData - The appointment data to create
 * @returns The ID of the created appointment
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
    console.error("Error creating appointment:", error)
    throw new Error("Unable to create appointment. Please try again.")
  }
}

/**
 * Updates an existing appointment
 * @param appointmentId - The ID of the appointment to update
 * @param appointmentData - The new appointment data
 * @returns The ID of the updated appointment
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
    console.error("Error updating appointment:", error)
    throw new Error("Unable to update appointment. Please try again.")
  }
}

/**
 * Retrieves an appointment by its ID
 * @param appointmentId - The ID of the appointment to retrieve
 * @returns The found appointment or null if no appointment is found
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
    console.error("Error retrieving appointment:", error)
    throw new Error("Unable to retrieve appointment. Please try again.")
  }
}

/**
 * Retrieves all appointments (useful for administration)
 * @returns A list of all appointments
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
    console.error("Error retrieving appointments:", error)
    throw new Error("Unable to retrieve appointments list. Please try again.")
  }
}

/**
 * Cancels an appointment by changing its status
 * @param appointmentId - The ID of the appointment to cancel
 * @returns The ID of the cancelled appointment
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
    console.error("Error cancelling appointment:", error)
    throw new Error("Unable to cancel appointment. Please try again.")
  }
}

/**
 * Confirms an appointment by changing its status
 * @param appointmentId - The ID of the appointment to confirm
 * @returns The ID of the confirmed appointment
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
    console.error("Error confirming appointment:", error)
    throw new Error("Unable to confirm appointment. Please try again.")
  }
}

/**
 * Deletes an appointment from the database
 * @param appointmentId - The ID of the appointment to delete
 */
export const deleteAppointment = async (
  appointmentId: string
): Promise<void> => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId)
    await deleteDoc(appointmentRef)
  } catch (error) {
    console.error("Error deleting appointment:", error)
    throw new Error("Unable to delete appointment. Please try again.")
  }
}

/**
 * Retrieves all appointments for a patient by email
 * @param email - The patient's email
 * @returns A list of the patient's appointments
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

    const appointments: Appointment[] = []

    for (const appointmentDoc of querySnapshot.docs) {
      const appointmentData = {
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      } as Appointment

      // Retrieve doctor information
      if (appointmentData.doctor) {
        // appointmentData.doctor contains the doctor's ID
        try {
          const doctorDoc = await getDoc(
            doc(db, "doctors", appointmentData.doctor)
          )
          if (doctorDoc.exists()) {
            const doctorData = doctorDoc.data()
            appointmentData.doctor = `${doctorData.firstName} ${doctorData.lastName}` // Replace with firstName + lastName
          }
        } catch (doctorError) {
          console.warn(
            `Unable to retrieve doctor information ${appointmentData.doctor}:`,
            doctorError
          )
          // Keep original ID in case of error
        }
      }

      appointments.push(appointmentData)
    }

    return appointments
  } catch (error) {
    console.error("Error retrieving appointments by email:", error)
    throw new Error(
      "Unable to retrieve appointments for this email. Please try again."
    )
  }
}

/**
 * Retrieves all appointments for a patient by phone number
 * @param phone - The patient's phone number
 * @returns A list of the patient's appointments
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

    const appointments: Appointment[] = []

    for (const appointmentDoc of querySnapshot.docs) {
      const appointmentData = {
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      } as Appointment

      // Retrieve doctor information
      if (appointmentData.doctor) {
        // appointmentData.doctor contains the doctor's ID
        try {
          const doctorDoc = await getDoc(
            doc(db, "doctors", appointmentData.doctor)
          )
          if (doctorDoc.exists()) {
            const doctorData = doctorDoc.data()
            appointmentData.doctor = `${doctorData.firstName} ${doctorData.lastName}` // Replace with firstName + lastName
          }
        } catch (doctorError) {
          console.warn(
            `Unable to retrieve doctor information ${appointmentData.doctor}:`,
            doctorError
          )
          // Keep original ID in case of error
        }
      }

      appointments.push(appointmentData)
    }

    return appointments
  } catch (error) {
    console.error("Error retrieving appointments by phone:", error)
    throw new Error(
      "Unable to retrieve appointments for this phone number. Please try again."
    )
  }
}

/**
 * Retrieves all appointments for a patient by email or phone
 * @param value - The patient's email or phone
 * @returns A list of the patient's appointments
 */
export const getAppointmentsByEmailOrPhone = async (
  value: string
): Promise<Appointment[]> => {
  try {
    // First check if it's an email (contains @)
    if (value.includes("@")) {
      return getAppointmentsByEmail(value)
    } else {
      // Otherwise consider it as a phone number
      return getAppointmentsByPhone(value)
    }
  } catch (error) {
    console.error("Error retrieving appointments:", error)
    throw new Error("Unable to retrieve appointments. Please try again.")
  }
}

/**
 * Retrieves all appointments for a patient by name
 * @param firstName - The patient's first name
 * @param lastName - The patient's last name
 * @returns A list of the patient's appointments
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
    console.error("Error retrieving patient appointments:", error)
    throw new Error(
      "Unable to retrieve patient appointments. Please try again."
    )
  }
}

/**
 * Retrieves all appointments for a patient by their ID
 * @param patientId - The patient's ID
 * @returns A list of the patient's appointments
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
    console.error("Error retrieving patient appointments:", error)
    throw new Error(
      "Unable to retrieve patient appointments. Please try again."
    )
  }
}

/**
 * Checks if a time slot is available
 * @param date - The appointment date (ISO format "YYYY-MM-DD")
 * @param time - The appointment time (format "HH:mm")
 * @param doctor - The doctor's name
 * @returns true if the time slot is available, false otherwise
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

    return querySnapshot.empty // If the query is empty, the time slot is available
  } catch (error) {
    console.error("Error checking time slot availability:", error)
    throw new Error("Unable to check availability. Please try again.")
  }
}

/**
 * Retrieves all appointments for a given date
 * @param date - The date of appointments to retrieve (ISO format "YYYY-MM-DD")
 * @returns A list of appointments for the specified date
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
    console.error("Error retrieving appointments by date:", error)
    throw new Error(
      "Unable to retrieve appointments for this date. Please try again."
    )
  }
}

/**
 * Retrieves all appointments for a given doctor
 * @param doctor - The doctor's name
 * @returns A list of appointments for the specified doctor
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
    console.error("Error retrieving appointments by doctor:", error)
    throw new Error(
      "Unable to retrieve appointments for this doctor. Please try again."
    )
  }
}

/**
 * Retrieves all appointments for a given specialty
 * @param specialty - The medical specialty
 * @returns A list of appointments for the specified specialty
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
    console.error("Error retrieving appointments by specialty:", error)
    throw new Error(
      "Unable to retrieve appointments for this specialty. Please try again."
    )
  }
}

/**
 * Retrieves all upcoming appointments (date >= today)
 * @returns A list of upcoming appointments
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
    console.error("Error retrieving upcoming appointments:", error)
    throw new Error(
      "Unable to retrieve upcoming appointments. Please try again."
    )
  }
}
