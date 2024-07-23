<template>
  <div class="w-96 h-80 bg-white shadow-md rounded-md relative">
    <NuxtLink
      :to="`/event/${event._id}`"
    >

      <!-- Event status -->
      <span 
        v-show="userStore.userData.role === 'admin' && $route.path === '/dashboard/events'" 
        :class="[
          'absolute top-2 left-2 text-xs font-semibold bg-white rounded-xl px-2 py-1',
          { 'text-red-500 italic': event.status === 'draft' }
        ]"
      >
        {{ event.status }}
      </span>

      <!-- Event Image -->
      <NuxtImg
        :src="event.eventImg || defaultImage"
        class="w-full h-40 object-cover"
      />

      <!-- Main content -->
      <div class="p-4 flex flex-col justify-between">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold">{{ event.eventName }}</h3>

          <!-- Options menu -->
          <div v-show="userStore.userData.role === 'admin' && $route.path === '/dashboard/events'">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical class="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @select="editEvent">
                  <Pencil class="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem @select="deleteEvent">
                  <Trash class="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <p class="text-sm text-gray-600">{{ formattedDate() }}</p>
        <p class="text-sm text-gray-600">
          {{ event.startTime }} - {{ event.endTime }}
        </p>
        <p class="text-sm text-gray-600">{{ event.place }}</p>
        <p class="text-md font-semibold mt-2">
          {{ event.eventPrice === 0 ? 'FREE' : `${event.eventPrice} €` }}
        </p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="category in event.categories"
            :key="category._id"
            class="bg-black text-white text-xs font-semibold px-4 py-1 rounded-xl"
          >
            {{ category.name }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { MoreVertical, Pencil, Trash } from 'lucide-vue-next'

const userStore = useUserStore()
const eventStore = useEventStore()
const router = useRouter()

const props = defineProps({
  event: Object,
})

const defaultImage = './defaultEvent.jpg'

const editEvent = () => {
  router.push(`/event/edit/${props.event._id}`)
}

const deleteEvent = async () => {
  const success = await eventStore.deleteEvent(props.event._id)
  if (success) {
    console.log('Event deleted successfully')
  } else {
    console.error('Failed to delete event')
  }
}

const formattedDate = () => {
  const { year, month, day } = props.event.eventDate
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
