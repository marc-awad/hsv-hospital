<script setup lang="ts">
import Logo from "../Molecule/Logo.vue"
import { RouterLink } from "vue-router"
</script>

<template>
  <nav class="flex items-center justify-between px-8 py-5 bg-white shadow-md">
    <!-- Logo -->
    <Logo text="HSV Hospital" />

    <!-- Navigation -->
    <ul class="flex gap-10 text-base font-semibold text-gray-800">
      <li>
        <RouterLink
          to="/"
          class="relative px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none"
          exact-active-class="text-[var(--color-primary)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-primary)] after:rounded-full after:opacity-100 after:transition-opacity"
          v-slot="{ isActive }"
        >
          <span :class="{ 'text-[var(--color-primary)]': isActive }">
            Home
          </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/booking"
          class="relative px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none"
          active-class="text-[var(--color-primary)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-primary)] after:rounded-full after:opacity-100 after:transition-opacity"
          v-slot="{ isActive }"
        >
          <span :class="{ 'text-[var(--color-primary)]': isActive }">
            Booking Appointment
          </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/tracking"
          class="relative px-2 py-1 cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none"
          active-class="text-[var(--color-primary)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-primary)] after:rounded-full after:opacity-100 after:transition-opacity"
          v-slot="{ isActive }"
        >
          <span :class="{ 'text-[var(--color-primary)]': isActive }">
            Tracking Appointment
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
