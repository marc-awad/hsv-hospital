<!-- Usage template : 

<Badge status="pending" />
<Badge status="confirmed" />
<Badge status="cancelled" />
<Badge status="rescheduled" />x

-->

<script setup lang="ts">
defineProps<{
  status: "pending" | "confirmed" | "cancelled" | "rescheduled" | string
}>()

const statusColors: Record<string, string> = {
  pending: "#fbbf24", // amber-400 (warning)
  confirmed: "#22c55e", // green-500 (success)
  cancelled: "#ef4444", // red-500 (danger)
  rescheduled: "#3b82f6", // blue-500 (info)
}

const color = statusColors[status] ?? "#6b7280" // gray-500 fallback
</script>

<template>
  <span class="badge" :style="{ backgroundColor: color }">{{ status }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1;
  border-radius: 9999px;
  color: white;
  text-transform: capitalize;
  user-select: none;
  white-space: nowrap;
}
</style>
