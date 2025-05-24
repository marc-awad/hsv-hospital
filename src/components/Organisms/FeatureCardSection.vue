<template>
  <div
    class="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8"
  >
    <FeatureCard
      title="Easy Booking"
      description="Select your specialty, preferred date, and get matched with the right doctor instantly."
      class="w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md"
    >
      <template #icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect x="2" y="6" width="20" height="16" rx="2"></rect>
          <path d="M12 14v4"></path>
          <path d="M10 16h4"></path>
        </svg>
      </template>
    </FeatureCard>

    <FeatureCard
      title="Real-time Tracking"
      description="Monitor the status of your appointment request and receive timely updates."
      class="w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md"
    >
      <template #icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
        >
          <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
          ></path>
          <path d="M12 6v6l4 2"></path>
        </svg>
      </template>
    </FeatureCard>

    <FeatureCard
      title="Quality Care"
      description="Access our team of qualified specialists dedicated to providing exceptional healthcare services."
      class="w-full sm:w-auto sm:max-w-xs md:max-w-sm lg:max-w-md"
    >
      <template #icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      </template>
    </FeatureCard>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from "../Molecule/FeatureCard.vue"
</script>
