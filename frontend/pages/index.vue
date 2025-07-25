<template>
  <Spinner v-if="isLoading" />
  <div
    v-else
    class="h-full bg-background text-secondary !flex !flex-col gap-2 items-center"
  >
    <NuxtImg
      src="/logo_color.png"
      alt="Evente Logo"
      class="min-w-[100px] max-w-[150px] mt-16 mb-10 md:hidden"
    />
    <Hero class="hidden md:flex" />
    <div class="w-full flex flex-col items-center h-fit">
      <div class="flex flex-col gap-2 px-4 w-full sm:px-0 sm:w-full md:w-full">
        <EventsCounter />
        <div
          class="w-full flex flex-col lg:flex-row justify-center md:justify-between mb-6"
        >
          <InfoLocation />
          <GeolocationMap />
          <div class="w-full lg:w-1/2 flex gap-4 items-center justify-end">
            <SearchInput v-model="searchQuery" />
            <CustomBtn :title="$t('filterBtn')" @click="openFilterModal" />
            <FilterModal class="self-end" type="event"/>
          </div>
        </div>
        <div class="hidden md:flex flex-col">
          <FilteredEventsHome />
        </div>
        <div class="md:hidden">
          <FilteredEventsHomeMobile />
        </div>
      </div>
      <Explore />
      <div class="flex flex-col gap-2 w-full mt-8">
        <FeaturedEvents class="hidden sm:block" />
        <ScrollXSFeaturedEvents class="xs:hidden" />
        <ArticlesHeader />
        <ArticlesList :articles="articleStore.articles" />
      </div>
      <SubscribeNewsletter />
    </div>
  </div>
<div
  v-if="openModalApp"
  class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[500px] h-fit border-2 border-primary bg-background rounded-lg z-50 shadow-xl p-6"
>
  <!-- Botón de cerrar X -->
  <div class="absolute top-[-12px] right-[-12px]">
    <button @click="closeModalApp()" class="text-background hover:text-secondary bg-primary rounded-full p-1">
      <LucideIcons.X class="w-5 h-5" />
    </button>
  </div>

  <!-- Contenido del modal -->
  <div class="flex flex-col items-center text-center gap-4">
    <span class="text-primary">Para una mejor experiencia <br>Recuerda activar la ubicación en tu movil.</span>
    <img src="/qrApp.png" alt="QR para descargar la app" class="w-32 h-32 mt-2" />
    <h2 class="text-secondary text-xl font-semibold">¡Descarga nuestra app!</h2>
    <p class="text-secondary text-sm px-2">

      Escanea el código QR para descargar la aplicación  y disfrutar de todas las funciones en tu móvil.
    </p>

    <!-- Botón de aceptar -->
    <button
      @click="closeModalApp()"
      class="bg-primary hover:bg-opacity-90 text-background font-medium px-4 py-2 rounded-lg mt-4"
    >
      {{$t('buttons.close')}}
    </button>
  </div>
</div>

</template>

<script setup>
useHead({
  link: [{ rel: 'canonical', href: 'https://evente.es' }],
  title: 'Evente',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content:
        'Descubre eventos emocionantes en tu área, desde conciertos hasta conferencias. ¡Únete a nuestra comunidad y no te pierdas ninguna promoción!',
    },
    {
      property: 'og:title',
      content: 'Evente - Tu página para encontrar y publicar eventos',
    },
    {
      property: 'og:description',
      content:
        'Descubre eventos emocionantes en tu área, desde conciertos hasta conferencias. ¡Únete a nuestra comunidad y no te pierdas ninguna promoción!',
    },
    {
      property: 'og:image',
      content:
        'https://res.cloudinary.com/drs1a2bso/image/upload/fl_preserve_transparency/v1725710854/logo_color_c8o0q3.jpg?_s=public-apps',
    },
    { property: 'og:url', content: 'https://evente.es' },
  ],
})
import * as LucideIcons from 'lucide-vue-next'

import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const eventStore = useEventStore()
const userStore = useUserStore()
const articleStore = useArticleStore()
import { useRuntimeConfig } from '#app'

const user = useNuxtApp().$user

const users = ref([])
const isLoading = ref(true)
const openModalApp = ref(false)

async function fetchUsers() {
  try {
    if (!isLoading.value) isLoading.value = true
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBaseUrl}/users`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.result) {
      users.value = data.result
      userStore.users = data.result
    }
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(async () => {
  if (userStore.checkAuthError.error) {
    toast({
      description: userStore.checkAuthError.message,
      variant: 'destructive',
    })
    userStore.setAuthError({ error: '', message: '' })
  }
  fetchUsers()
  eventStore.resetFilters()
  userStore.fetchAndSetUser(userStore.userData?.email)
  if (localStorage.dayDiff || localStorage.originalDate) {
    delete localStorage.dayDiff
    delete localStorage.originalDate
    delete localStorage.plan
  }
  if (!sessionStorage.getItem('modalAppShown')) {
  openModalApp.value = true
  sessionStorage.setItem('modalAppShown', 'true')
}
})

const searchQuery = computed({
  get: () => eventStore.searchQuery,
  set: (value) => eventStore.setSearchQuery(value),
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

const closeModalApp = () => {
  openModalApp.value = false
}
</script>
