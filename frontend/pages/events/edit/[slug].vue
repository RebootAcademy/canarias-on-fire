<template>
  <div class="flex justify-center">
    <div class="md:w-2/3 p-4">
      <header class="text-2xl font-bold mt-6 mb-3 tracking-tighter">{{ $t('editEvent') }}</header>
      <div v-if="loading" class="text-center">
        <p>{{ $t('loadingEditEvent') }}</p>
      </div>

      <div v-else-if="error" class="text-red-500">
        <p>{{ $t('errorLoadingEvent') }}</p>
      </div>
      <EventForm v-else :isEditing="true" />
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '@/stores/eventStore'

const route = useRoute()

const eventStore = useEventStore()

const { event, loading, error } = storeToRefs(eventStore)

const slug = route.params.slug

onMounted(() => {
  eventStore.fetchEventBySlug(slug)
})

useHead({
  title: 'Edit Event',
})
</script>
