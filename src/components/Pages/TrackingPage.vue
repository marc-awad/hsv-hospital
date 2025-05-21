<template>
  <div class="flex flex-col items-center text-center my-8 gap-y-4">
    <PageTitle title="Track Your Appointment" :sizeRem="2.5" color="primary" />
    <SecondaryText :shade="500" :sizeRem="1.2" :maxWidthPx="600"
      >Easily find and manage your upcoming appointment by providing your
      personal information below.</SecondaryText
    >
    <FormSearchAppointment />
  </div>
</template>

<script>
import PageTitle from "../Atoms/PageTitle.vue"
import SecondaryText from "../Atoms/SecondaryText.vue"
import FormSearchAppointment from "../Organisms/FormSearchAppointment.vue"
export default {
  components: { PageTitle, SecondaryText, FormSearchAppointment },
}
</script>
