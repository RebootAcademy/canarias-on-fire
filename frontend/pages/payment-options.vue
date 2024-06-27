<template>
  <div class="p-12 text-sm">
    <p class="text-xs">Event ID: {{  $route.query.id  }}</p>
    <p>Status: <span class="font-bold">{{ eventStore.status }}</span></p>
    <p>Event type: <span class="font-bold">{{ eventStore.eventType }}</span></p>
    <p>Event date: <span class="font-bold">{{ eventStore.eventDate }}</span></p>
    <p>Choose subscription plan:</p>
    <div>
      <SubscriptionPlans />
    </div>

  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

</script>