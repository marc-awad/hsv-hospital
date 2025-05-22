<template>
  <div
    class="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold">
          {{ appointment.firstName }} {{ appointment.lastName }}
        </h3>
        <p class="text-gray-600">
          {{ appointment.specialty }} with Dr. {{ appointment.doctor }}
        </p>
      </div>
      <div class="text-right">
        <p class="font-medium">{{ formatDate(appointment.date) }}</p>
        <p class="text-gray-600">{{ formatTime(appointment.time) }}</p>
      </div>
    </div>

    <div class="flex items-center text-sm mb-4">
      <StatusBadge :status="appointment.status" />
    </div>

    <div class="flex justify-end space-x-3 mt-4">
      <Button
        v-if="appointment.status !== 'cancelled'"
        size="sm"
        @click="$emit('modify', appointment)"
      >
        Modify Appointment
      </Button>
      <Button
        v-if="appointment.status !== 'cancelled'"
        size="sm"
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
          typeof appointment.id !== 'undefined' &&
          typeof appointment.firstName === 'string' &&
          typeof appointment.lastName === 'string' &&
          typeof appointment.specialty === 'string' &&
          typeof appointment.doctor === 'string' &&
          typeof appointment.date === 'string' &&
          typeof appointment.time === 'string' &&
          typeof appointment.status === 'string'
        )
      }
    }
  },

  emits: ['modify', 'cancel'],

  methods: {
    formatDate(dateString) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },

    formatTime(timeString) {
      return timeString
    }
  }
}
</script>