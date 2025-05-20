<template>
  <div class="flex flex-col items-center justify-center text-center my-8 gap-y-4">
    <PageTitle
      title="Book your appointment in just a few clicks"
      :sizeRem="3.25"
      color="primary"
    />
    <SecondaryText :shade="500" :sizeRem="1.6" :maxWidthPx="800">
      Access quality healthcare services with ease at HSV Hospital - your health
      is our priority since 2017.
    </SecondaryText>
  </div>
</template>

<script>
import PageTitle from "../Atoms/PageTitle.vue"
import SecondaryText from "../Atoms/SecondaryText.vue"
export default {
  components: { PageTitle, SecondaryText },
}
</script>
