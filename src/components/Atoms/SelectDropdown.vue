<!-- Use template : 
 
<SelectDropdown
  id="specialty"
  label="Spécialité médicale"
  :options="[
    { value: 'cardiology', label: 'Cardiologie' },
    { value: 'dermatology', label: 'Dermatologie' },
    { value: 'neurology', label: 'Neurologie' }
  ]"
  v-model="selectedSpecialty"
  :required="true"
  placeholder="Choisissez une spécialité"
/>


-->

<template>
  <div class="select-dropdown">
    <label v-if="label" :for="id" class="select-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :disabled="disabled"
      class="select"
      :aria-invalid="!!error"
    >
      <option value="" disabled hidden>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="text-error">{{ error }}</p>
    <p v-else-if="helperText" class="text-helper">{{ helperText }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "SelectDropdown",
  props: {
    modelValue: { type: String, default: "" },
    id: { type: String, required: true },
    label: { type: String, default: "" },
    options: {
      type: Array as () => { value: string; label: string }[],
      required: true,
    },
    placeholder: { type: String, default: "Sélectionnez une spécialité" },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    error: { type: String, default: "" },
    helperText: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
})
</script>

<style scoped>
.select-dropdown {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
  font-family: Arial, sans-serif;
}

.select-label {
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.required {
  color: var(--color-error);
  margin-left: 0.25rem;
}

.select {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-surface);
  border-radius: 0.375rem;
  background-color: white;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.3);
}

.select:disabled {
  background-color: var(--color-surface);
  cursor: not-allowed;
  opacity: 0.7;
}

.text-error {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-error);
}

.text-helper {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.65);
}
</style>
