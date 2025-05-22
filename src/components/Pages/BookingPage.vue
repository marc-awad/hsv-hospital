<template>
  <div class="flex flex-col items-center text-center my-8 gap-y-4">
    <PageTitle title="Book Your Appointment" :sizeRem="2.5" color="primary" />
    <SecondaryText :shade="500" :sizeRem="1.2" :maxWidthPx="600">
      Fill out the form below to schedule a consultation with one of our
      specialists.
    </SecondaryText>
  </div>
  <div
    class="w-full max-w-4xl mx-auto px-6 my-14 rounded-md py-6"
    style="
      box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1),
        0 -8px 15px -3px rgba(0, 0, 0, 0.1);
    "
  >
    <FormAppointment @appointment-submitted="handleAppointmentSubmission" />
  </div>
</template>
<script>
import PageTitle from "../Atoms/PageTitle.vue"
import SecondaryText from "../Atoms/SecondaryText.vue"
import FormAppointment from "../Organisms/FormAppointment.vue"
import { ref } from "vue"
import { useRouter } from "vue-router"

export default {
  components: { PageTitle, SecondaryText, FormAppointment },

  setup() {
    const appointmentData = ref(null)
    const router = useRouter() // initialise le router ici

    const handleAppointmentSubmission = (data) => {
      appointmentData.value = data
      router.push("/success") // redirection après soumission
    }

    return { appointmentData, handleAppointmentSubmission }
  },
}
</script>
