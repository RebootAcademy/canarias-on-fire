<template>
  <div class="flex flex-col mt-4 gap-4">
    <CategorySelector />
    <EventInfoForm />
    <Button @click="handleSubmit">Preview</Button>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { useRouter } from 'vue-router'

const eventStore = useEventStore()
const router = useRouter()

const handleSubmit = () => {
  eventStore.status = 'draft'

  router.push({
    name: 'event-preview'
  })
}

</script>