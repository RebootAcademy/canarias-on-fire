<template>
  <div class="p-12">
    <h1>Choose Your Business Type and Payment Options</h1>
    <p class="text-xs">Event ID: {{  $route.query.id  }}</p>
    <p>Event type: {{ eventStore.eventType }}</p>
    <p>Event date: {{ eventStore.eventDate }}</p>
    <p>Choose suscription plan:</p>
    <div>
      <SubscriptionPlans />
    </div>

  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

</script>