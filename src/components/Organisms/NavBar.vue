<script setup lang="ts">
import { ref } from "vue"
import Logo from "../Molecule/Logo.vue"
import { RouterLink } from "vue-router"

const isMenuOpen = ref(false)
</script>

<template>
  <nav class="bg-white shadow-md px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <Logo text="HSV Hospital" />

      <!-- Bouton burger (mobile uniquement) -->
      <button
        class="sm:hidden text-gray-800 focus:outline-none"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Menu (desktop) -->
      <ul class="hidden sm:flex gap-8 text-base font-semibold text-gray-800">
        <li>
          <RouterLink
            to="/"
            exact-active-class="text-[var(--color-primary)]"
            v-slot="{ isActive }"
            class="relative px-2 py-1"
          >
            <span
              :class="{
                'text-[var(--color-primary)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-primary)] after:rounded-full after:content-[\'\']':
                  isActive,
              }"
            >
              Home
            </span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/booking"
            active-class="text-[var(--color-primary)]"
            v-slot="{ isActive }"
            class="relative px-2 py-1"
          >
            <span
              :class="{
                'text-[var(--color-primary)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-primary)] after:rounded-full after:content-[\'\']':
                  isActive,
              }"
            >
              Booking Appointment
            </span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/tracking"
            active-class="text-[var(--color-primary)]"
            v-slot="{ isActive }"
            class="relative px-2 py-1"
          >
            <span
              :class="{
                'text-[var(--color-primary)] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[var(--color-primary)] after:rounded-full after:content-[\'\']':
                  isActive,
              }"
            >
              Manage Appointment
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- Menu mobile (visible uniquement si isMenuOpen) -->
    <ul
      v-if="isMenuOpen"
      class="flex flex-col gap-4 mt-4 text-base font-semibold text-gray-800 sm:hidden"
    >
      <li>
        <RouterLink
          to="/"
          exact-active-class="text-[var(--color-primary)]"
          v-slot="{ isActive }"
          class="px-2 py-1"
          @click="isMenuOpen = false"
        >
          <span :class="{ 'text-[var(--color-primary)]': isActive }">
            Home
          </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/booking"
          active-class="text-[var(--color-primary)]"
          v-slot="{ isActive }"
          class="px-2 py-1"
          @click="isMenuOpen = false"
        >
          <span :class="{ 'text-[var(--color-primary)]': isActive }">
            Booking Appointment
          </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/tracking"
          active-class="text-[var(--color-primary)]"
          v-slot="{ isActive }"
          class="px-2 py-1"
          @click="isMenuOpen = false"
        >
          <span :class="{ 'text-[var(--color-primary)]': isActive }">
            Tracking Appointment
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
