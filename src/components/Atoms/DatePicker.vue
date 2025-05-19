<!-- Use template:


<DatePicker
  id="appointment-date"
  v-model="appointmentDate"
  label="Date du rendez-vous"
  :required="true"
  :minDate="new Date().toISOString().split('T')[0]"  
  helperText="Choisissez la date souhaitée pour votre consultation"
/> 

-->

<template>
  <div class="date-picker">
    <label v-if="label" :for="id" class="date-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :id="id"
      type="date"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :disabled="disabled"
      :min="minDate"
      :max="maxDate"
      class="date-input"
      :aria-invalid="!!error"
    />
    <p v-if="error" class="text-error">{{ error }}</p>
    <p v-else-if="helperText" class="text-helper">{{ helperText }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "DatePicker",
  props: {
    modelValue: { type: String, default: "" }, // format "YYYY-MM-DD"
    id: { type: String, required: true },
    label: { type: String, default: "Date du rendez-vous" },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    minDate: { type: String, default: undefined }, // optional min date (ex: today)
    maxDate: { type: String, default: undefined }, // optional max date
    error: { type: String, default: "" },
    helperText: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
})
</script>

<style scoped>
.date-picker {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
  font-family: Arial, sans-serif;
}

.date-label {
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.required {
  color: var(--color-error);
  margin-left: 0.25rem;
}

.date-input {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-surface);
  border-radius: 0.375rem;
  background-color: white;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.date-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.3);
}

.date-input:disabled {
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
