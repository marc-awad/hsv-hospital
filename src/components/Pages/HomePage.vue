<template>
  <div
    class="flex flex-col items-center justify-center text-center my-8 gap-y-4"
  >
    <PageTitle
      title="Book your appointment in just a few clicks"
      :sizeRem="2.5"
      color="primary"
    />
    <SecondaryText :shade="500" :sizeRem="1.25" :maxWidthPx="600">
      Access quality healthcare services with ease at HSV Hospital - your health
      is our priority since 2017.
    </SecondaryText>
    <div class="mt-4 flex gap-x-8 justify-center">
      <Button to="/booking">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M9 16l2 2 4-4"></path>
          </svg>
        </template>
        Book an Appointment</Button
      >
      <Button to="/tracking" variant="tertiary">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
            ></polygon>
          </svg>
        </template>
        Track Appointment
      </Button>
    </div>
  </div>
</template>

<script>
import PageTitle from "../Atoms/PageTitle.vue"
import SecondaryText from "../Atoms/SecondaryText.vue"
import Button from "../Atoms/Button.vue"
export default {
  components: { PageTitle, SecondaryText, Button },
}
</script>
