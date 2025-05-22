<template>
  <div
    class="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <!-- Ligne 1: Patient, Specialty, Doctor -->
    <div class="grid grid-cols-3 gap-4 mb-6 text-left">
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Patient</p>
        <p class="font-medium">
          {{ appointment.firstName }} {{ appointment.lastName }}
        </p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Specialty</p>
        <p class="font-medium">
          {{ formatSpecialty(appointment.specialty) }}
        </p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Doctor</p>
        <p class="font-medium">Dr. {{ appointment.doctor }}</p>
      </div>
    </div>

    <!-- Ligne 2: Date, Time, Status -->
    <div class="grid grid-cols-3 gap-4 mb-6 text-left">
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Date</p>
        <p class="font-medium">{{ formatDate(appointment.date) }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Time</p>
        <p class="font-medium">{{ formatTime(appointment.time) }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Status</p>
        <StatusBadge :status="appointment.status" />
      </div>
    </div>

    <!-- Ligne 3: Boutons alignés à gauche -->
    <div class="flex justify-start space-x-3 mt-4">
      <Button
        v-if="appointment.status !== 'cancelled'"
        variant="secondary"
        @click="$emit('modify', appointment)"
      >
        Modify Appointment
      </Button>
      <Button
        v-if="appointment.status !== 'cancelled'"
        variant="danger"
        @click="$emit('cancel', appointment)"
      >
        Cancel Appointment
      </Button>
    </div>
  </div>
</template>

<script>
import Button from "../Atoms/Button.vue"
import StatusBadge from "../Atoms/StatusBadge.vue"

export default {
  name: "AppointmentCard",
  components: { Button, StatusBadge },

  props: {
    appointment: {
      type: Object,
      required: true,
      validator(appointment) {
        return (
          appointment &&
          typeof appointment.id !== "undefined" &&
          typeof appointment.firstName === "string" &&
          typeof appointment.lastName === "string" &&
          typeof appointment.specialty === "string" &&
          typeof appointment.doctor === "string" &&
          typeof appointment.date === "string" &&
          typeof appointment.time === "string" &&
          typeof appointment.status === "string"
        )
      },
    },
  },

  emits: ["modify", "cancel"],

  methods: {
    formatSpecialty(specialty) {
      if (specialty === "generalmedicine") {
        return "General Medicine"
      }
      // Pour les autres spécialités, mettre une majuscule à la première lettre
      return (
        specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase()
      )
    },

    formatDate(dateString) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      // Spécifier la locale anglaise 'en-US' ou 'en-GB'
      return new Date(dateString).toLocaleDateString("en-US", options)
    },

    formatTime(timeString) {
      // Si vous voulez aussi formater l'heure en format anglais (12h avec AM/PM)
      const [hours, minutes] = timeString.split(":")
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })

      // Ou simplement retourner le format 24h original :
      // return timeString
    },
  },
}
</script>
