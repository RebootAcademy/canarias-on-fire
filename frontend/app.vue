<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup>
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()

onMounted(async () => {
  await eventStore.fetchEvents()
  await eventStore.fetchCategories()
})
</script>