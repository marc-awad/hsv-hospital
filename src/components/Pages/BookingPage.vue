<template>
  <div class="flex flex-col items-center text-center my-8 gap-y-4">
    <PageTitle title="Book Your Appointment" :sizeRem="2.5" color="primary" />
    <SecondaryText :shade="500" :sizeRem="1.2" :maxWidthPx="600"
      >Fill out the form below to schedule a consultation with one of our
      specialists.</SecondaryText
    >
  </div>
</template>

<script>
import PageTitle from "../Atoms/PageTitle.vue"
import SecondaryText from "../Atoms/SecondaryText.vue"
export default {
  components: { PageTitle, SecondaryText },
}
</script>
