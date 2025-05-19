<!-- Usage template :

 <TextInput
    id="last-name"
    label="Nom"
    v-model="lastName"
    placeholder="Entrez votre nom"
    required
    :maxLength="50"
    helperText="Votre nom de famille"
    :error="lastNameError"
/> 
    
-->

<template>
  <div class="text-input-container">
    <label v-if="label" :for="id" class="text-input-label">
      {{ label }}<span v-if="required">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :maxlength="maxLength"
      :aria-invalid="!!error"
      class="text-input"
    />
    <p v-if="error" class="text-error">{{ error }}</p>
    <p v-else-if="success" class="text-success">{{ success }}</p>
    <p v-else-if="helperText" class="text-helper">{{ helperText }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "TextInput",
  props: {
    modelValue: { type: [String, Number], default: "" },
    id: { type: String, required: true },
    label: { type: String, default: "" },
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    helperText: { type: String, default: "" },
    error: { type: String, default: "" },
    success: { type: String, default: "" },
    maxLength: { type: Number, default: undefined },
  },
  emits: ["update:modelValue"],
})
</script>

<style scoped>
.text-input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
}

.text-input-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.text-input-label span {
  color: red;
  margin-left: 0.25rem;
}

.text-input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.text-input:focus {
  border-color: #5b21b6;
  box-shadow: 0 0 3px #a78bfa;
}

.text-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.text-success {
  color: #16a34a;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.text-helper {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
