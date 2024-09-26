<template>
    <div class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4">
        <PromotionCard v-for="promotion in promotionsEvent" :key="promotion._id" :promotion="promotion" />
    </div>
</template>

<script setup>  
import { storeToRefs } from 'pinia'
const eventStore = useEventStore()

const { filteredEvents} = storeToRefs(eventStore)

const promotionsEvent = computed(() => {
    return filteredEvents.value.filter(event => event.eventType === 'promotion')
})

console.log(promotionsEvent.value)
</script>