<template>
  <div class="flex flex-wrap justify-center gap-12">
    <FeatureCard
      title="Easy Booking"
      description="Select your specialty, preferred date, and get matched with the right doctor instantly."
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
