<template>
  <div
    class="border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <!-- Patient, Specialty, Doctor -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6 text-left"
    >
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Patient</p>
        <p class="font-medium">{{ patientName }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Specialty</p>
        <p class="font-medium">{{ specialtyDisplay }}</p>
      </div>
      <div class="sm:col-span-2 lg:col-span-1">
        <p class="text-xs text-gray-500 tracking-wide mb-2">Doctor</p>
        <p class="font-medium">{{ doctorDisplay }}</p>
      </div>
    </div>

    <!-- Date, Time, Status -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6 text-left"
    >
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Date</p>
        <p class="font-medium">{{ dateDisplay }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Time</p>
        <p class="font-medium">{{ timeDisplay }}</p>
      </div>
      <div class="sm:col-span-2 lg:col-span-1">
        <p class="text-xs text-gray-500 tracking-wide mb-2">Status</p>
        <StatusBadge :status="appointment.status || 'pending'" />
      </div>
    </div>

    <!-- Buttons -->
    <div
      v-if="showButtons && appointment.status !== 'cancelled'"
      class="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-3 mt-4"
    >
      <Button variant="secondary" @click="$emit('modify', appointment)">
        Modify Appointment Time
      </Button>
      <Button variant="danger" @click="$emit('cancel', appointment)">
        Cancel Appointment
      </Button>
    </div>
  </div>
</template>

<script>
import Button from "../Atoms/Button.vue"
import StatusBadge from "../Atoms/StatusBadge.vue"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"

export default {
  name: "AppointmentCard",
  components: { Button, StatusBadge },

  props: {
    appointment: { type: Object, required: true },
    showButtons: { type: Boolean, default: true },
  },

  emits: ["modify", "cancel"],

  data: () => ({ doctorInfo: null, loadingDoctor: false }),

  async mounted() {
    await this.fetchDoctorInfo()
  },

  watch: { "appointment.doctorId": "fetchDoctorInfo" },

  computed: {
    patientName() {
      return `${this.appointment.firstName || "Unknown"} ${
        this.appointment.lastName || "Patient"
      }`
    },

    specialtyDisplay() {
      const specialty =
        this.appointment.specialtyName ||
        this.appointment.specialty ||
        this.appointment.specialtyId
      if (!specialty) return "Unknown Specialty"
      if (specialty === "generalmedicine") return "General Medicine"
      if (specialty.includes(" ")) return specialty
      return (
        specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase()
      )
    },

    doctorDisplay() {
      const name = this.appointment.doctorName?.trim()

      if (name) {
        return name.toLowerCase().startsWith("dr") ? name : `Dr. ${name}`
      }

      return this.appointment.doctorId
        ? `Dr. (ID: ${this.appointment.doctorId})`
        : "Doctor not assigned"
    },
    appointmentDate() {
      const { appointmentStart, date } = this.appointment
      if (appointmentStart) {
        if (typeof appointmentStart === "string")
          return new Date(appointmentStart)
        if (appointmentStart instanceof Date) return appointmentStart
        if (appointmentStart.toDate) return appointmentStart.toDate()
        if (appointmentStart.seconds)
          return new Date(appointmentStart.seconds * 1000)
      }
      return date ? new Date(date) : new Date()
    },

    dateDisplay() {
      try {
        return this.appointmentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } catch {
        return "Date not specified"
      }
    },

    timeDisplay() {
      try {
        const startDate = this.appointmentDate
        const endDate = this.appointment.appointmentEnd
          ? this.parseDateTime(this.appointment.appointmentEnd)
          : null

        const formatTime = (date) =>
          date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })

        if (endDate) return `${formatTime(startDate)} - ${formatTime(endDate)}`
        return formatTime(startDate)
      } catch {
        return this.appointment.time || "Time not specified"
      }
    },
  },

  methods: {
    async fetchDoctorInfo() {
      if (
        !this.appointment.doctorId ||
        this.doctorInfo?.id === this.appointment.doctorId
      )
        return

      this.loadingDoctor = true
      try {
        const snap = await getDoc(doc(db, "doctors", this.appointment.doctorId))
        this.doctorInfo = snap.exists() ? { id: snap.id, ...snap.data() } : null
      } catch (error) {
        console.error("Error fetching doctor:", error)
        this.doctorInfo = null
      } finally {
        this.loadingDoctor = false
      }
    },

    parseDateTime(value) {
      if (!value) return null
      if (typeof value === "string") return new Date(value)
      if (value instanceof Date) return value
      if (value.toDate) return value.toDate()
      if (value.seconds) return new Date(value.seconds * 1000)
      return null
    },
  },
}
</script>
