<template>
  <div
    v-if="appointmentData"
    class="flex flex-col items-center text-center my-8 gap-y-4"
  >
    <div
      class="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-10 h-10 text-[#22c55e]"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>

    <PageTitle
      title="Appointment Successfully Booked!"
      :sizeRem="1.9"
      color="primary"
    />

    <SecondaryText :shade="400" :sizeRem="1.15" :maxWidthPx="600">
      Your appointment request has been successfully registered. Please keep
      this information for your records. A confirmation email with all the
      details has also been sent to your inbox.
    </SecondaryText>

    <AppointmentCard :appointment="appointmentData" :showButtons="false" />

    <div class="flex flex-col sm:flex-row gap-4">
      <Button to="/" variant="secondary">
        <template #default>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Return to Homepage
        </template>
      </Button>

      <Button to="/tracking">
        <template #default>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2"
          >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path
              d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
            />
          </svg>
          Track My Appointment
        </template>
      </Button>
    </div>
  </div>

  <div v-else class="text-center my-8">
    <p>No appointment data found.</p>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import PageTitle from "../Atoms/PageTitle.vue"
import SecondaryText from "../Atoms/SecondaryText.vue"
import Button from "../Atoms/Button.vue"
import AppointmentCard from "../Molecule/AppointmentCard.vue"

const route = useRoute()
const appointmentData = ref(null)

onMounted(() => {
  if (route.query.data) {
    try {
      const data = JSON.parse(route.query.data)
      appointmentData.value = data
      // console.log("appointmentData after parsing:", appointmentData.value)
    } catch (e) {
      console.error("Failed to parse appointmentData from query:", e)
      appointmentData.value = null
    }
  }
})
</script>
