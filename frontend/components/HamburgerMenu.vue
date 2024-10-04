<template>
  <div>
    <!-- Icono de hamburguesa que abre o cierra el menú -->
    <AlignJustify class="text-secondary cursor-pointer" @click.stop="toggleMenu" />
<transition name="slide" >

    <div
      v-show="isOpen"
      ref="menuRef"
      class="fixed top-0 left-0 w-full h-auto text-secondary border-b-2 bg-background pb-2 bg-opacity-90 z-50"
    >
      <div class="p-6">
        <div class="flex justify-between items-center">
          <NuxtLink to="/" class="flex items-end">
            <NuxtImg src="logo_color.png" class="w-28" />
          </NuxtLink>
          <X name="x" class="w-6 h-6 cursor-pointer" @click="toggleMenu" />
        </div>

        <nav class="mt-4">
          <div class="flex flex-col text-sm gap-1 py-2 mt-2">
            <DetailsItemMenu
              :title="$t('events&Promotions')"
              :options="[
                {
                  label: t('findEvents.label'),
                  path: '/events',
                  roles: ['all'],
                },
                {
                  label: t('findPromotions.label'),
                  path: '/promotions',
                  roles: ['all'],
                },
                {
                  label: t('eventCreate.label'),
                  path: '/events/create',
                  roles: ['company', 'admin'],
                },
                {
                  label: isAdmin
                    ? t('dashboardNav.manageEvents')
                    : t('myEvents.label'),
                  path: '/dashboard/events',
                  roles: ['company', 'admin'],
                },
                { label: 'Planea tu fiesta', path: '/', roles: ['all'] },
              ]"
            />
          </div>
          <hr class="mx-2 mb-4" />
          <!-- Articles Section -->
          <DetailsItemMenu
            :title="$t('articles')"
            :options="[
              {
                label: t('findArticles.label'),
                path: '/articles',
                roles: ['all'],
              },
              {
                label: t('createArticles.label'),
                path: '/articles/create',
                roles: ['company'],
              },
              {
                label: t('manageArticles.label'),
                path: '/dashboard/articles',
                roles: ['admin'],
              },
            ]"
          />
          <hr class="mx-2 mb-4" />

          <!-- Plan your party -->
          <NuxtLink to="/inspire" class="font-bold text-md">
            <p class="font-bold text-lg ml-2 py-2 hover:text-primary">
              {{ $t('dashboardNav.plannedYourEvents') }}
            </p>
          </NuxtLink>
          <hr class="mx-2 mb-4" />
          <!-- Explore Section -->
          <DetailsItemMenu
            :title="$t('explore')"
            :options="[
              { label: t('findMusic.label'), path: '/bands', roles: ['all'] },
              {
                label: t('findRestaurants.label'),
                path: '/restaurants',
                roles: ['all'],
              },
            ]"
          />
          <hr class="mx-2 mb-4" />
          <!-- Pricing Section -->
          <NuxtLink
            v-if="isLogged"
            to="/pricing/promotions"
            class="font-bold text-md"
          >
            <p class="font-bold text-lg ml-2 py-2 hover:text-primary">
              {{ $t('pricing') }}
            </p>
          </NuxtLink>
          <hr v-if="isLogged" class="mx-2 mb-4" />
          <!-- Help Section -->
          <DetailsItemMenu
            :title="$t('help')"
            :options="[
              {
                label: t('helping.label'),
                path: '/help/general',
                roles: ['all'],
              },
              { label: t('contactUs.label'), path: '/contact', roles: ['all'] },
            ]"
          />
          <hr class="mx-2 mb-4" />
          <!-- Dashboard Section -->
          <NuxtLink
            v-if="isLogged"
            to="/dashboard/profile"
            
          >
            <p class="font-bold text-lg ml-2 py-2 hover:text-primary">
              {{ $t('dashboard') }}
            </p>
          </NuxtLink>
          <hr v-if="isLogged" class="mx-2 mb-4" />
          <!-- Languages Section -->
          <details class="custom-details p-2 cursor-pointer">
            <summary class="font-bold hover:text-primary">
              <div class="flex text-lg items-center justify-between">
                {{ $t('languages') }}
                <ChevronDown size="16" class="icon-tabler-chevron-down" />
              </div>
            </summary>
            <LangSelectorBurgerMenu />
          </details>
          <hr class="mx-2 mb-4" />
          <!-- Logout Section -->
          <AuthenticationBurgerMenu />
          <hr class="mx-2 mb-6" />
          <div class="flex w-full justify-end pr-6">
            <ThemeSwitcher />
          </div>
        </nav>

        <hr class="mx-32 rounded-lg mb-4 mt-12 border-2" >
      </div>
    </div>
</transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlignJustify, X, ChevronDown } from 'lucide-vue-next'
const { t } = useI18n()
const userStore = useUserStore()
const isAdmin = computed(() => userStore?.userData?.role === 'admin')
const isLogged = computed(() => userStore.isAuthenticated)
const isOpen = ref(false)
const menuRef = ref(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  console.log(isOpen.value)
}
const handleClickOutside = (event) => {
  // Solo se ejecuta si el menú está abierto y el clic ocurre fuera del menú
  if (isOpen.value && menuRef.value && !menuRef.value.contains(event.target)) {
    isOpen.value = false
  }
}



onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

onMounted(() => {
  console.log(menuRef.value) // Esto debe mostrar el elemento DOM del menú
  document.addEventListener('click', handleClickOutside)
})

</script>



<style scoped>
.custom-details summary {
  list-style: none !important; 
}

.custom-details summary::-webkit-details-marker {
  display: none; /* Para navegadores WebKit */
}

.custom-details[open] .icon-tabler-chevron-down {
  transform: rotate(180deg); /* Rota el ícono cuando se abre */
  transition: transform 1.5s ease;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.9s ease, 1s ease;
}

.slide-enter, .slide-leave-to {
  transform: translateY(-100%); /* Desliza el menú desde la parte superior */
  opacity: 0;
}

.slide-leave {
  transform: translateY(0); /* Mantiene la posición original antes de deslizarse */
  opacity: 1;
}
</style>
