<template>
  <div
    class="w-full max-w-4xl mx-auto px-4 sm:px-6 my-8 sm:my-14 rounded-md py-4 sm:py-6"
    style="
      box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1),
        0 -8px 15px -3px rgba(0, 0, 0, 0.1);
    "
  >
    <PageTitle
      title="Search for your appointment"
      :sizeRem="1.3"
      color="primary"
      class="text-left mb-6 sm:mb-8"
    />
    <form @submit.prevent="searchAppointments" class="text-left">
      <Input
        label="Email"
        v-model="email"
        inputId="email"
        placeholder="your.email@example.com"
        class="mb-4 sm:mb-6"
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
      <div class="flex justify-center sm:justify-start">
        <Button
          type="submit"
          class="mt-4 sm:mt-6 w-full sm:w-auto"
          :loading="loading"
          >Search</Button
        >
      </div>
    </form>

    <!-- Affichage des résultats -->
    <div v-if="searchPerformed" class="mt-8 sm:mt-10">
      <h2 class="text-lg sm:text-xl font-semibold mb-4">Search Results</h2>

      <div v-if="loading" class="text-center py-8">
        <p>Searching for appointments...</p>
      </div>

      <div v-else-if="appointments.length === 0" class="text-center py-8">
        <p>No appointments found for this contact information.</p>
      </div>

      <div v-else class="space-y-4 sm:space-y-6">
        <AppointmentCard
          v-for="appointment in appointments"
          :key="appointment.id"
          :appointment="appointment"
          :patientEmail="appointment.email"
          @cancel="confirmCancelAppointment"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import PageTitle from "../Atoms/PageTitle.vue"
import Button from "../Atoms/Button.vue"
import Input from "../Atoms/Input.vue"
import AppointmentCard from "../Molecule/AppointmentCard.vue"
import {
  getAppointmentsByEmail,
  getAppointmentsByPhone,
  cancelAppointment,
} from "../../store/appointmentService"
import {
  showErrorAlert,
  showSuccessAlert,
  showMissingFieldAlert,
  showConfirmDialog,
  showModifyAppointmentModalSimple,
} from "../../store/sweetalert"

export default {
  components: { PageTitle, Button, Input, AppointmentCard },

  setup() {
    const email = ref("")
    const phone = ref("")
    const appointments = ref([])
    const loading = ref(false)
    const searchPerformed = ref(false)

    const searchAppointments = async () => {
      if (!email.value && !phone.value) {
        showMissingFieldAlert("Please enter an email or phone number")
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
        showErrorAlert(
          "An error occurred while searching for appointments. Please try again."
        )
      } finally {
        loading.value = false
      }
    }

    const parseDateTime = (value) => {
      if (!value) return null
      if (typeof value === "string") return new Date(value)
      if (value instanceof Date) return value
      if (value.toDate) return value.toDate()
      if (value.seconds) return new Date(value.seconds * 1000)
      return null
    }

    // Dans le composant parent, remplacez la méthode confirmCancelAppointment par :

    const confirmCancelAppointment = async (appointment) => {
      // Si l'appointment contient le flag _verified, c'est que la vérification par email a déjà été faite
      if (appointment._verified) {
        console.log(
          "✅ Vérification par email déjà effectuée, suppression directe"
        )
        await cancelAppointmentAction(appointment.id)
        return
      }

      // Sinon, afficher la modal de confirmation classique (pour les cas sans vérification email)
      const formatDate = (date) => {
        if (!(date instanceof Date)) return "Invalid Date"
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      }

      const formatTime = (date) => {
        if (!(date instanceof Date)) return "Time invalid"
        return date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      }

      const appointmentDate = parseDateTime(appointment.appointmentStart)

      const result = await showConfirmDialog(
        "Cancel Appointment",
        `Are you sure you want to cancel your appointment with Dr. ${
          appointment.doctorName
        } on ${formatDate(appointmentDate)} at ${formatTime(appointmentDate)}?`
      )

      if (result.isConfirmed) {
        await cancelAppointmentAction(appointment.id)
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
        showSuccessAlert("Appointment successfully cancelled")
      } catch (error) {
        // console.error("Error cancelling appointment:", error)
        showErrorAlert(
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
      confirmCancelAppointment,
    }
  },
}
</script>
