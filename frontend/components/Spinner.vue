<template>
  <div :class="[' flex items-center justify-center z-50 ', containerClasses]">
    <div
      class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-primary"
    />
  </div>
</template>

<script setup>
defineProps({
  containerClasses: {
    type: [String, Array, Object],
    default: 'fixed inset-0 h-screen w-screen bg-white',
  },
})
</script>

<style lang="scss" scoped></style>
