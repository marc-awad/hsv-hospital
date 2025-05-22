<template>
  <span
    class="px-2 py-1 rounded-full text-xs font-medium"
    :class="badgeClasses"
  >
    {{ displayText }}
  </span>
</template>

<script>
export default {
  name: "StatusBadge",

  props: {
    status: {
      type: String,
      required: true,
      validator(value) {
        return ["confirmed", "pending", "cancelled"].includes(value)
      },
    },
    size: {
      type: String,
      default: "sm",
      validator(value) {
        return ["xs", "sm", "md", "lg"].includes(value)
      },
    },
  },

  computed: {
    badgeClasses() {
      const baseClasses = this.sizeClasses
      const statusClasses = this.statusClasses
      return `${baseClasses} ${statusClasses}`
    },

    sizeClasses() {
      const sizes = {
        xs: "px-1.5 py-0.5 text-xs",
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      }
      return `${sizes[this.size]} rounded-full font-medium`
    },

    statusClasses() {
      const classes = {
        confirmed: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
      }
      return classes[this.status] || classes.pending
    },

    displayText() {
      return this.capitalizeFirstLetter(this.status)
    },
  },

  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
  },
}
</script>
