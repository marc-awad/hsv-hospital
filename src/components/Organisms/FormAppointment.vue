<template>
  <div>
    <form @submit.prevent="submitForm" class="w-full">
      <div class="flex items-center mb-6 text-left gap-2 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <PageTitle title="Patient Information" :sizeRem="1.4" />
      </div>

      <div class="grid grid-cols-2 gap-6 mb-8">
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
          class="col-span-2"
        />
        <Input
          label="Email"
          inputId="email"
          type="email"
          placeholder="your.email@example.com"
          v-model="email"
          required
          class="col-span-2"
        />
      </div>

      <div class="flex items-center mb-6 text-left gap-2 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <PageTitle title="Appointment Details" :sizeRem="1.4" />
      </div>

      <div class="grid grid-cols-2 gap-6 mb-12">
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

        <div
          v-if="showDoctorField"
          class="transition-all duration-300 ease-in-out"
        >
          <Select
            label="Doctor"
            inputId="doctor"
            placeholder="Select a doctor"
            v-model="doctor"
            required
            :options="filteredDoctorsOptions"
            :loading="loadingDoctors"
            :disabled="!specialty || loadingDoctors"
          />
        </div>

        <Input
          label="Preferred Date"
          inputId="date"
          type="date"
          required
          v-model="date"
        />
        <Select
          label="Preferred Time"
          inputId="time"
          placeholder="Select a time"
          v-model="time"
          required
          :options="timeSlots"
        />
      </div>

      <div class="flex justify-end mt-6">
        <Button type="submit" :disabled="isSubmitting">
          <svg
            v-if="!isSubmitting"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
            stroke-linecap="round"
            stroke-linejoin="round"
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
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "vue-router"
import { showErrorAlert } from "../../store/sweetalert"

const router = useRouter()

// Import des services
import {
  fetchSpecialties,
  type SelectOption,
} from "../../store/specialtiesService"
import {
  fetchDoctorsBySpecialty,
  type Doctor,
} from "../../store/doctorsService"

// Import du service patient
import {
  createOrUpdatePatient,
  type CreatePatientData,
} from "../../store/patientService"

// Données du formulaire
const firstName = ref("")
const lastName = ref("")
const email = ref("")
const phone = ref("")
const specialty = ref("")
const doctor = ref("")
const date = ref("")
const time = ref("")

// États de chargement
const loadingSpecialties = ref(false)
const loadingDoctors = ref(false)
const isSubmitting = ref(false)

// Données des options
const specialtiesOptions = ref<SelectOption[]>([])
const allDoctors = ref<Doctor[]>([])

// Créneaux horaires disponibles
const timeSlots: SelectOption[] = [
  { label: "09:00", value: "09:00" },
  { label: "09:30", value: "09:30" },
  { label: "10:00", value: "10:00" },
  { label: "10:30", value: "10:30" },
  { label: "11:00", value: "11:00" },
  { label: "11:30", value: "11:30" },
  { label: "12:00", value: "12:00" },
  { label: "12:30", value: "12:30" },
  { label: "14:00", value: "14:00" },
  { label: "14:30", value: "14:30" },
  { label: "15:00", value: "15:00" },
  { label: "15:30", value: "15:30" },
  { label: "16:00", value: "16:00" },
  { label: "16:30", value: "16:30" },
  { label: "17:00", value: "17:00" },
]

// Computed properties
const showDoctorField = computed(() => specialty.value !== "")

const filteredDoctorsOptions = computed((): SelectOption[] => {
  if (!specialty.value || allDoctors.value.length === 0) {
    return []
  }

  return allDoctors.value
    .filter((doc) => doc.specialty === specialty.value)
    .map((doc) => ({
      label: doc.name,
      value: doc.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

// Fonction de chargement des spécialités
const loadSpecialties = async (): Promise<void> => {
  try {
    loadingSpecialties.value = true
    specialtiesOptions.value = await fetchSpecialties()
  } catch (error: unknown) {
    if (error instanceof Error) {
      showErrorAlert(error.message)
    } else {
      showErrorAlert(String(error))
    }
  } finally {
    loadingSpecialties.value = false
  }
}

// Fonction de chargement des médecins par spécialité
const loadDoctorsBySpecialty = async (specialtyId: string): Promise<void> => {
  if (!specialtyId) return

  try {
    loadingDoctors.value = true
    const doctorsForSpecialty = await fetchDoctorsBySpecialty(specialtyId)

    // Mettre à jour seulement les médecins de cette spécialité
    allDoctors.value = allDoctors.value.filter(
      (doc) => doc.specialty !== specialtyId
    )
    allDoctors.value.push(...doctorsForSpecialty)
  } catch (error) {
    console.error(error)
  } finally {
    loadingDoctors.value = false
  }
}

// Gestionnaire de changement de spécialité
const onSpecialtyChange = async (newSpecialty: string): Promise<void> => {
  doctor.value = ""

  if (newSpecialty) {
    const hasSpecialtyDoctors = allDoctors.value.some(
      (doc) => doc.specialty === newSpecialty
    )
    if (!hasSpecialtyDoctors) {
      await loadDoctorsBySpecialty(newSpecialty)
    }
  }
}

// Fonction de soumission du formulaire
const submitForm = async (): Promise<void> => {
  const selectedDoctorLabel =
    filteredDoctorsOptions.value.find((option) => option.value === doctor.value)
      ?.label || ""

  try {
    isSubmitting.value = true

    if (
      !firstName.value ||
      !lastName.value ||
      !email.value ||
      !phone.value ||
      !specialty.value ||
      !doctor.value ||
      !date.value ||
      !time.value
    ) {
      showErrorAlert("Please fill in all required fields.")
      return
    }
    if (!/^\+?[0-9\s\-\.]{8,15}$/.test(phone.value)) {
      showErrorAlert("Please enter a valid phone number.")
      return
    }
    const selectedDate = new Date(date.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      showErrorAlert("The appointment date cannot be earlier than today.")
      return
    }
    const appointmentData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      specialty: specialty.value,
      doctor: selectedDoctorLabel,
      date: date.value,
      time: time.value,
      status: "pending",
    }

    // 1. Préparer les données du patient
    const patientData: CreatePatientData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
    }

    // 2. Créer ou mettre à jour le patient en utilisant le service
    const patientId = await createOrUpdatePatient(patientData)

    // 3. Créer le rendez-vous avec l'ID du patient
    await addDoc(collection(db, "appointments"), {
      patientId: patientId,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      specialty: specialty.value,
      doctor: doctor.value,
      date: date.value,
      time: time.value,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    isSubmitting.value = true

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

// Fonction de réinitialisation du formulaire
const resetForm = (): void => {
  firstName.value = ""
  lastName.value = ""
  email.value = ""
  phone.value = ""
  specialty.value = ""
  doctor.value = ""
  date.value = ""
  time.value = ""
}

// Initialisation
onMounted(async () => {
  await loadSpecialties()
})
</script>
