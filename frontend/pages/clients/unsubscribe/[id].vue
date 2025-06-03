<template>
  <div class="flex h-screen flex-col gap-8 items-center justify-center">
    <h1 class="text-3xl">{{ title }}</h1>

    <div class="flex gap-4" v-if="!unsubscribe">
      <NuxtLink to="/">
        <div
          class="bg-primary-gradient p-0.5 font-bold rounded-md hover:opacity-90"
        >
          <div class="bg-background p-4 px-6 rounded-md hover:bg-gray">
            {{ $t('buttons.cancel') }}
          </div>
        </div>
      </NuxtLink>
      <div
        class="bg-primary-gradient p-0.5 font-bold rounded-md hover:opacity-90"
      >
        <button
          @click="handleUnsubscribe"
          class="bg-primary-gradient p-4 px-6 font-bold rounded-md hover:opacity-90"
        >
          {{ $t('buttons.confirm') }}
        </button>
      </div>
    </div>
    <NuxtLink v-if="unsubscribe" to="/">
      <div
        class="bg-primary-gradient p-0.5 font-bold rounded-md hover:opacity-90"
      >
        <div
          class="bg-primary-gradient p-4 px-6 font-bold rounded-md hover:opacity-90"
        >
          {{ $t('buttons.backHome') }}
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const title = ref(t('canceledView.sureunsubscribe'))
const unsubscribe = ref(false)
const token = route.query.token

const handleUnsubscribe = async () => {
  if (!route.params.id || !token) {
    title.value = t('canceledView.invalidLink')
    return
  }
  try {
    const response = await $fetch(
      `${useRuntimeConfig().public.apiBaseUrl}/clients/unsubscribe/${
        route.params.id
      }?token=${token}`,
      {
        method: 'PATCH',
      }
    )
    if (response.success) {
      // Handle successful unsubscription
      title.value = t('canceledView.unsubscribeSuccess')
      unsubscribe.value = true
      console.log('Unsubscription successful')
    } else {
      // Handle failure
      console.error('Unsubscription failed:', response.message)
    }
  } catch (error) {
    // Handle error
    console.error('Error during unsubscription:', error)
  }
}
</script>
