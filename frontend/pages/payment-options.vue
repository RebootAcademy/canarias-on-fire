<template>
  <div class="p-12 text-sm">
    <p class="text-xs">Event ID: {{  $route.query.id  }}</p>
    <p>Status: <span class="font-bold">{{ eventStore.status }}</span></p>
    <p>Event type: <span class="font-bold">{{ eventStore.eventType }}</span></p>
    <p>Event date: <span class="font-bold">{{ eventStore.eventDate }}</span></p>
    <p>Choose subscription plan:</p>
    <div>
      <SubscriptionPlans />
      <Button @click="handleBasicPublish">Publicar (BASIC)</Button>
    </div>

  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { useUserStore } from '../stores/userStore'
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0()

const eventStore = useEventStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

const basicPublish = async (eventId) => {
  try {
    const token = await getAccessTokenSilently()

    const response = await fetch(`${config.public.apiBaseUrl}/events/${eventId || route.query.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        status: 'published',
/*         userId: userId */
      })
    })
    if (response.ok) {
      router.push('/')
    } else {
      console.error('Error publishing event')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const handleBasicPublish = () => {
  if (!isAuthenticated.value) {
    loginWithRedirect({
      appState: { 
        returnTo: window.location.pathname,
        eventId: route.query.id 
      }
    })
  } else {
    basicPublish(route.query.id)
  }
}

</script>