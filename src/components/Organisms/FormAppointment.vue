<template>
  <div>
    <form @submit.prevent="submitForm" class="w-full">
      <!-- Patient Information -->
      <div class="flex items-center mb-6 text-left gap-2 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <PageTitle title="Patient Information" :sizeRem="1.4" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <Input
          label="First Name"
          inputId="firstName"
          placeholder="Your first name"
          v-model="firstName"
          required
        />
        <Input
          label="Last Name"
          inputId="lastName"
          placeholder="Your last name"
          v-model="lastName"
          required
        />
        <Input
          label="Phone Number"
          inputId="phone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          v-model="phone"
          required
          class="sm:col-span-2"
        />
        <Input
          label="Email"
          inputId="email"
          type="email"
          placeholder="your.email@example.com"
          v-model="email"
          required
          class="sm:col-span-2"
        />
      </div>

      <!-- Appointment Details -->
      <div class="flex items-center mb-6 text-left gap-2 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <PageTitle title="Appointment Details" :sizeRem="1.4" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <Select
          label="Medical Specialty"
          inputId="speciality"
          placeholder="Select a specialty"
          v-model="specialty"
          required
          :options="specialtiesOptions"
          :loading="loadingSpecialties"
          @update:modelValue="onSpecialtyChange"
        />

        <Select
          v-if="specialty"
          label="Doctor"
          inputId="doctor"
          placeholder="Select a doctor"
          v-model="doctor"
          required
          :options="doctorsOptions"
          :loading="loadingDoctors"
          @update:modelValue="onDoctorChange"
        />
      </div>

      <!-- Calendar Section -->
      <div v-if="doctor" class="mb-8">
        <div class="flex items-center mb-6 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-blue-600"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ selectedDoctor?.name }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ selectedDoctor?.specialty }}
              </p>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div
            class="flex items-center gap-2"
            v-for="legend in legends"
            :key="legend.label"
          >
            <div class="w-4 h-4 rounded" :class="legend.color"></div>
            <span class="text-sm text-gray-700">{{ legend.label }}</span>
          </div>
        </div>

        <!-- FullCalendar -->
        <div class="calendar-wrapper bg-white rounded-lg shadow-sm border">
          <FullCalendar ref="calendar" :options="calendarOptions" />
        </div>

        <!-- Selected Slot Display -->
        <div
          v-if="selectedSlot"
          class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-green-600"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="text-green-800 font-medium"
              >Selected: {{ formatSlot(selectedSlot.start) }}</span
            >
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center sm:justify-end mt-6">
        <Button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="w-full sm:w-auto"
        >
          <svg
            v-if="!isSubmitting"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg
            v-else
            class="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          {{ isSubmitting ? "Submitting..." : "Confirm Appointment" }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Button from "../Atoms/Button.vue"
import Input from "../Atoms/Input.vue"
import Select from "../Atoms/Select.vue"
import PageTitle from "../Atoms/PageTitle.vue"
import { ref, computed, onMounted } from "vue"
import { db } from "../../firebase/firebase"
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { useRouter } from "vue-router"
import { showErrorAlert } from "../../store/sweetalert"

import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

import {
  fetchSpecialties,
  type SelectOption,
} from "../../store/specialtiesService"
import {
  fetchDoctorsBySpecialty,
  type Doctor,
} from "../../store/doctorsService"
import {
  createOrUpdatePatient,
  type CreatePatientData,
} from "../../store/patientService"

const router = useRouter()

// Form data
const firstName = ref("")
const lastName = ref("")
const email = ref("")
const phone = ref("")
const specialty = ref("")
const doctor = ref("")

// Loading states
const loadingSpecialties = ref(false)
const loadingDoctors = ref(false)
const isSubmitting = ref(false)

// Options data
const specialtiesOptions = ref<SelectOption[]>([])
const doctors = ref<Doctor[]>([])
const bookedSlots = ref<any[]>([])
const selectedSlot = ref<any>(null)

// Computed
const doctorsOptions = computed((): SelectOption[] =>
  doctors.value
    .filter((doc) => doc.specialty === specialty.value)
    .map((doc) => ({ label: doc.name, value: doc.id }))
    .sort((a, b) => a.label.localeCompare(b.label))
)

const selectedDoctor = computed(() =>
  doctors.value.find((doc) => doc.id === doctor.value)
)

const isFormValid = computed(
  () =>
    firstName.value &&
    lastName.value &&
    email.value &&
    phone.value &&
    specialty.value &&
    doctor.value &&
    selectedSlot.value
)

const legends = [
  { label: "Available", color: "bg-green-500" },
  { label: "Booked", color: "bg-red-500" },
  { label: "Break", color: "bg-yellow-500" },
]

// Generate time slots for next 6 months (weekdays only, 9-12, 14-17)
const generateTimeSlots = () => {
  const slots: any[] = []
  const today = new Date()
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth() + 6,
    today.getDate()
  )

  for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue // Skip weekends

    // Morning slots (9-12) and afternoon slots (14-17)
    const timeRanges = [
      [9, 12],
      [14, 17],
    ]

    timeRanges.forEach(([start, end]) => {
      for (let hour = start; hour < end; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(d)
          slotStart.setHours(hour, minute, 0, 0)
          const slotEnd = new Date(slotStart)
          slotEnd.setMinutes(slotEnd.getMinutes() + 30)

          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
          })
        }
      }
    })
  }

  return slots
}

// Check if slot is booked
const isSlotBooked = (start: string, end: string): boolean =>
  bookedSlots.value.some((slot) => {
    const slotStart = new Date(slot.start)
    const slotEnd = new Date(slot.end)
    const checkStart = new Date(start)
    const checkEnd = new Date(end)

    return (
      (checkStart >= slotStart && checkStart < slotEnd) ||
      (checkEnd > slotStart && checkEnd <= slotEnd) ||
      (checkStart <= slotStart && checkEnd >= slotEnd)
    )
  })

// Calendar events
const calendarEvents = computed(() => {
  const events = []

  // Available slots
  generateTimeSlots().forEach((slot) => {
    if (!isSlotBooked(slot.start, slot.end)) {
      events.push({
        title: "Available",
        start: slot.start,
        end: slot.end,
        backgroundColor: "#10b981",
        borderColor: "#10b981",
        textColor: "#ffffff",
        extendedProps: { type: "available" },
        classNames: ["cursor-pointer"],
      })
    }
  })

  // Booked slots
  bookedSlots.value.forEach((slot) => {
    events.push({
      title: "Booked",
      start: slot.start,
      end: slot.end,
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
      textColor: "#ffffff",
      extendedProps: { type: "booked" },
    })
  })

  // Lunch breaks (12-14)
  const today = new Date()
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth() + 6,
    today.getDate()
  )

  for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue

    const lunchStart = new Date(d)
    lunchStart.setHours(12, 0, 0, 0)
    const lunchEnd = new Date(d)
    lunchEnd.setHours(14, 0, 0, 0)

    events.push({
      title: "Lunch Break",
      start: lunchStart.toISOString(),
      end: lunchEnd.toISOString(),
      backgroundColor: "#f59e0b",
      borderColor: "#f59e0b",
      textColor: "#ffffff",
      extendedProps: { type: "break" },
    })
  }

  return events
})

// Calendar configuration
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "timeGridWeek",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  slotMinTime: "08:00:00",
  slotMaxTime: "18:00:00",
  slotDuration: "00:30:00",
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: "09:00",
    endTime: "17:00",
  },
  weekends: false,
  events: calendarEvents.value,
  eventClick: (info: any) => {
    if (info.event.extendedProps.type === "available") {
      selectedSlot.value = { start: info.event.start, end: info.event.end }
    }
  },
  height: "auto",
  validRange: { start: new Date().toISOString().split("T")[0] },
}))

// Utility functions
const formatSlot = (start: Date | string) => {
  const date = new Date(start)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const resetForm = () => {
  firstName.value = lastName.value = email.value = phone.value = ""
  specialty.value = doctor.value = ""
  selectedSlot.value = null
}

// Event handlers
const onSpecialtyChange = async (newSpecialty: string) => {
  doctor.value = ""
  selectedSlot.value = null

  if (
    newSpecialty &&
    !doctors.value.some((doc) => doc.specialty === newSpecialty)
  ) {
    loadingDoctors.value = true
    try {
      const newDoctors = await fetchDoctorsBySpecialty(newSpecialty)
      doctors.value = [
        ...doctors.value.filter((doc) => doc.specialty !== newSpecialty),
        ...newDoctors,
      ]
    } catch (error) {
      showErrorAlert("Failed to load doctors")
    } finally {
      loadingDoctors.value = false
    }
  }
}

const onDoctorChange = async (newDoctor: string) => {
  selectedSlot.value = null
  if (newDoctor) await loadBookedAppointments()
}

const loadBookedAppointments = async () => {
  if (!doctor.value) return

  try {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctor.value),
      where("status", "in", ["confirmed", "pending"])
    )

    const querySnapshot = await getDocs(q)
    const appointments: any[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.appointmentStart && data.appointmentEnd) {
        appointments.push({
          start: data.appointmentStart.toDate().toISOString(),
          end: data.appointmentEnd.toDate().toISOString(),
          status: data.status,
        })
      }
    })

    bookedSlots.value = appointments
  } catch (error) {
    console.error("Error loading appointments:", error)
  }
}
// Fonction corrigée pour checkSlotAvailability
const checkSlotAvailability = async (
  doctorId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId),
      where("status", "in", ["confirmed", "pending"]),
      where("appointmentStart", "<", Timestamp.fromDate(endTime)),
      where("appointmentEnd", ">", Timestamp.fromDate(startTime))
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.empty
  } catch (error) {
    console.error("Error checking availability:", error)
    return false
  }
}

const submitForm = async () => {
  try {
    isSubmitting.value = true

    if (!isFormValid.value) {
      showErrorAlert(
        "Please fill in all required fields and select an appointment time."
      )
      return
    }

    if (!/^\+?[0-9\s\-\.]{8,15}$/.test(phone.value)) {
      showErrorAlert("Please enter a valid phone number.")
      return
    }

    const startTime = new Date(selectedSlot.value.start)
    const endTime = new Date(selectedSlot.value.end)

    // Check availability
    const isAvailable = await checkSlotAvailability(
      doctor.value,
      startTime,
      endTime
    )
    if (!isAvailable) {
      showErrorAlert(
        "This time slot has just been booked. Please select another time."
      )
      await loadBookedAppointments()
      selectedSlot.value = null
      return
    }

    // Create patient
    const patientData: CreatePatientData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
    }
    const patientId = await createOrUpdatePatient(patientData)

    // Create appointment
    const appointmentData = {
      patientId,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      doctorId: doctor.value,
      specialtyId: specialty.value,
      appointmentStart: Timestamp.fromDate(startTime),
      appointmentEnd: Timestamp.fromDate(endTime),
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await addDoc(collection(db, "appointments"), appointmentData)
    await loadBookedAppointments()

    const isDev = import.meta.env.MODE === "development"

    try {
      if (!isDev) {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email.value,
            appointment: appointmentData,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to send email")
        }
      } else {
        console.log("Dev mode: email not sent")
      }

      resetForm()
      router.push({
        path: "/success",
        query: {
          data: JSON.stringify(appointmentData),
        },
      })
    } catch (error) {
      console.error(error)
      alert("Erreur lors de l'envoi de l'email.")
    } finally {
      isSubmitting.value = false
    }
  } catch (error: unknown) {
    console.error("Error while adding the document:", error)

    if (error instanceof Error) {
      showErrorAlert(error.message)
    } else {
      showErrorAlert("Failed to submit the appointment. Please try again.")
    }
  } finally {
    isSubmitting.value = false
  }
}

// Initialize
onMounted(async () => {
  loadingSpecialties.value = true
  try {
    specialtiesOptions.value = await fetchSpecialties()
  } catch (error) {
    showErrorAlert("Failed to load specialties")
  } finally {
    loadingSpecialties.value = false
  }
})
</script>

<style>
.fc-event {
  transition: all 0.2s ease;
}
.fc-event:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.fc-event-title {
  font-weight: 500;
  font-size: 0.85rem;
}
.calendar-wrapper {
  min-height: 600px;
}

@media (max-width: 768px) {
  .fc-header-toolbar {
    flex-direction: column;
    gap: 10px;
  }
  .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
  }
}
</style>
