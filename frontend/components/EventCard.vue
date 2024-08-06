<template>
  <NuxtLink :to="`/events/${event._id}`">
    <div class="relative w-[300px] h-[332px] rounded-lg border">
      <!-- Event status -->
      <span
        v-show="userStore.userData.role === 'admin' && $route.path === '/dashboard/events'"
        :class="[
          'absolute top-2 left-2 text-xs font-semibold bg-white rounded-xl px-2 py-1 text-black',
          { 'text-red-500 italic': event.status === 'draft' },
        ]"
      >
        {{ event.status }}
      </span>

      <!-- Event Image -->
      <NuxtImg
        :src="event.eventImg || defaultImage"
        class="w-full h-40 object-cover rounded-t-lg"
      />
      <!-- Main content -->
      <div class="px-3 py-2 flex justify-between">
      <!-- Categories -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="category in event.categories"
            :key="category._id"
            class="bg-gray-700 text-white text-xs font-normal px-2.5 py-0.5 rounded-xl self-center"
          >
            {{ category.name }}
          </span>
        </div>
        <!-- Options menu -->
        <div v-show="userStore.userData.role === 'admin'">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                class="h-4 w-4 text-gray-500 hover:text-gray-700"
              />
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
      <div class="flex flex-col justify-between items-start px-3">
        <h3 class="text-xl font-semibold">{{ event.eventName }}</h3>
        <p class="text-sm text-gray-600">{{ formattedDate() }} at {{ event.startTime }} - {{ event.endTime }}</p>
        <p class="text-sm text-gray-600 line-clamp-2">{{ event.eventLocation.address }}</p>
        <p class="text-md font-semibold mt-2">{{ event.eventPrice === 0 ? 'FREE' : `${event.eventPrice} €` }}</p>
      </div>

    </div>
  </NuxtLink>
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
  router.push(`/events/edit/${props.event._id}`)
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
  if (!props.event.eventDate) {
    return 'Date not available'
  }
  const { year, month, day } = props.event.eventDate
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

