<template>
  <div
    class="w-full max-w-4xl mx-auto px-6 my-14 rounded-md py-6"
    style="
      box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1),
        0 -8px 15px -3px rgba(0, 0, 0, 0.1);
    "
  >
    <PageTitle
      title="Search for your appointment"
      :sizeRem="1.3"
      color="primary"
      class="text-left mb-8"
    />
    <form @submit.prevent="searchAppointments" class="text-left">
      <Input
        label="Email"
        v-model="email"
        inputId="email"
        placeholder="your.email@example.com"
        class="mb-6"
      />
      <div class="flex items-center my-4">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="mx-4 text-gray-400 font-semibold">OR</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      <Input
        label="Phone Number"
        v-model="phone"
        inputId="phone"
        placeholder="+33 6 12 34 56 78"
      />
      <Button type="submit" class="mt-6" :loading="loading">Search</Button>
    </form>

    <!-- Affichage des résultats -->
    <div v-if="searchPerformed" class="mt-10">
      <h2 class="text-xl font-semibold mb-4">Search Results</h2>

      <div v-if="loading" class="text-center py-8">
        <p>Searching for appointments...</p>
      </div>

      <div v-else-if="appointments.length === 0" class="text-center py-8">
        <p>No appointments found for this contact information.</p>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="appointment in appointments"
          :key="appointment.id"
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
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800':
                  appointment.status === 'confirmed',
                'bg-yellow-100 text-yellow-800':
                  appointment.status === 'pending',
                'bg-red-100 text-red-800': appointment.status === 'cancelled',
              }"
            >
              {{ capitalizeFirstLetter(appointment.status) }}
            </span>
          </div>

          <div class="flex justify-end space-x-3 mt-4">
            <Button
              v-if="appointment.status !== 'cancelled'"
              variant="outline"
              size="sm"
              @click="modifyAppointment(appointment)"
            >
              Modify Appointment
            </Button>
            <Button
              v-if="appointment.status !== 'cancelled'"
              variant="danger"
              size="sm"
              @click="confirmCancelAppointment(appointment)"
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import PageTitle from "../Atoms/PageTitle.vue"
import Button from "../Atoms/Button.vue"
import Input from "../Atoms/Input.vue"
import {
  getAppointmentsByEmail,
  getAppointmentsByPhone,
  cancelAppointment,
} from "../../store/appointmentService"

export default {
  components: { PageTitle, Button, Input },

  setup() {
    const email = ref("")
    const phone = ref("")
    const appointments = ref([])
    const loading = ref(false)
    const searchPerformed = ref(false)

    const searchAppointments = async () => {
      if (!email.value && !phone.value) {
        alert("Please enter an email or phone number")
        return
      }

      loading.value = true
      searchPerformed.value = true

      try {
        if (email.value) {
          appointments.value = await getAppointmentsByEmail(email.value)
        } else if (phone.value) {
          appointments.value = await getAppointmentsByPhone(phone.value)
        }
      } catch (error) {
        console.error("Error searching for appointments:", error)
        alert(
          "An error occurred while searching for appointments. Please try again."
        )
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateString) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const formatTime = (timeString) => {
      return timeString
    }

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const modifyAppointment = (appointment) => {
      // Rediriger vers la page de modification ou afficher un modal
      console.log("Modify appointment:", appointment)
      // Vous pouvez implémenter la navigation ou afficher un modal ici
    }

    const confirmCancelAppointment = (appointment) => {
      if (
        confirm(
          `Are you sure you want to cancel your appointment with Dr. ${
            appointment.doctor
          } on ${formatDate(appointment.date)} at ${appointment.time}?`
        )
      ) {
        cancelAppointmentAction(appointment.id)
      }
    }

    const cancelAppointmentAction = async (appointmentId) => {
      loading.value = true

      try {
        await cancelAppointment(appointmentId)
        // Mettre à jour l'état local pour refléter l'annulation
        const index = appointments.value.findIndex(
          (app) => app.id === appointmentId
        )
        if (index !== -1) {
          appointments.value[index].status = "cancelled"
        }
        alert("Appointment successfully cancelled")
      } catch (error) {
        console.error("Error cancelling appointment:", error)
        alert(
          "An error occurred while cancelling the appointment. Please try again."
        )
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      phone,
      appointments,
      loading,
      searchPerformed,
      searchAppointments,
      formatDate,
      formatTime,
      capitalizeFirstLetter,
      modifyAppointment,
      confirmCancelAppointment,
    }
  },
}
</script>
