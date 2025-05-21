<template>
  <div>
    <form action="" class="w-full">
      <div class="flex items-center mb-6 text-left gap-2 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <PageTitle title="Patient Information" :sizeRem="1.4" />
      </div>

      <div class="grid grid-cols-2 gap-6 mb-8">
        <Input
          label="First Name"
          inputId="firstName"
          placeholder="Your first name"
          required
        />
        <Input
          label="Last Name"
          inputId="lastName"
          placeholder="Your last name"
          required
        />
        <Input
          label="Email"
          inputId="email"
          type="email"
          placeholder="your.email@example.com"
          required
          class="col-span-2"
        />
      </div>

      <div class="flex items-center mb-6 text-left gap-2 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
        </svg>
        <PageTitle title="Appointment Details" :sizeRem="1.4" />
      </div>

      <div class="grid grid-cols-2 gap-6 mb-12">
        <Select
          label="Medical Specialty"
          inputId="speciality"
          placeholder="Select a specialty"
          required
          :options="[
            { label: 'Cardiology', value: 'cardiology' },
            { label: 'Dermatology', value: 'dermatology' },
            { label: 'Neurology', value: 'neurology' },
            { label: 'Orthopedics', value: 'orthopedics' },
            { label: 'Pediatrics', value: 'pediatrics' },
            { label: 'Gynecology', value: 'gynecology' },
            { label: 'Ophthalmology', value: 'ophthalmology' },
            { label: 'Psychiatry', value: 'psychiatry' },
            { label: 'Urology', value: 'urology' },
            { label: 'General Medicine', value: 'general' },
          ]"
        />

        <Input label="Preferred Date" inputId="date" type="date" required />
        <Select
          label="Preferred Time"
          inputId="time"
          placeholder="Select a time"
          required
          :options="[
            { label: '09:00', value: '09:00' },
            { label: '09:30', value: '09:30' },
            { label: '10:00', value: '10:00' },
            { label: '10:30', value: '10:30' },
            { label: '11:00', value: '11:00' },
            { label: '11:30', value: '11:30' },
            { label: '12:00', value: '12:00' },
            { label: '12:30', value: '12:30' },
            { label: '14:00', value: '14:00' },
            { label: '14:30', value: '14:30' },
            { label: '15:00', value: '15:00' },
            { label: '15:30', value: '15:30' },
            { label: '16:00', value: '16:00' },
            { label: '16:30', value: '16:30' },
            { label: '17:00', value: '17:00' },
          ]"
        />
      </div>
      <div class="flex justify-end mt-6">
        <Button type="submit">
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
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Confirm Appointment</Button
        >
      </div>
    </form>
  </div>
</template>

<script>
import Button from "../Atoms/Button.vue"
import Input from "../Atoms/Input.vue"
import Select from "../Atoms/Select.vue"
import PageTitle from "../Atoms/PageTitle.vue"
export default {
  components: { Button, Input, Select, PageTitle },
}
</script>
