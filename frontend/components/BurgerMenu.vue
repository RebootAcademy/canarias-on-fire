<template>
    <Menubar  class="relative data-[state=open]:bg-transparent bg-transparent border-none focus:bg-transparente active:bg-transparent">
        <MenubarMenu>
          <MenubarTrigger class="data-[state=open]:bg-transparent focus:bg-transparent" >
            <AlignJustify class="text-white cursor-pointer" @click="toggleMenu"/>
        </MenubarTrigger>
          <MenubarContent v-if="isMenuOpen"  class="bg-background pb-72 overflow-auto translate-y-0 xs:w-screen md:hidden text-secondary border-none">
            <div class="flex p-2 mt-2 px-6 justify-between items-center">
              <NuxtLink to="/" class="flex items-end">
                <NuxtImg src="logo_color.png" class="w-28"/>
              </NuxtLink>
              <X size="30" class="mr-3 cursor-pointer" @click="closeMenuManually"/>
            </div>
            <div class="flex flex-col gap-2 p-2 px-6 mt-6">
              <!-- Events Section -->
               <DetailsItemMenu 
                :title="$t('events')"
                :options="[
                  { label: t('findEvents.label'), path: '/events', roles: ['all'] },
                  { label: t('findPromotions.label'), path: '/promotions', roles: ['all'] },
                  { label: t('eventCreate.label'), path: '/events/create', roles: ['company', 'admin'] },
                  { label: isAdmin ? t('dashboardNav.manageEvents') : t('myEvents.label') , path: '/dashboard/events', roles: ['company', 'admin'] },
                  { label: 'Planea tu fiesta', path: '/', roles: ['all'] }
                ]"
              />
              <MenubarSeparator class="mx-2 mb-4"/>
              <!-- Articles Section -->
               <DetailsItemMenu 
                :title="$t('articles')"
                :options="[
                  { label: t('findArticles.label'), path: '/articles', roles: ['all'] },
                  { label: t('createArticles.label'), path: '/articles/create', roles: ['company'] },
                  { label: t('manageArticles.label'), path: '/dashboard/articles', roles: ['admin'] },

                ]"
              />
              <MenubarSeparator class="mx-2 mb-4"/>
              <!-- Explore Section -->
              <DetailsItemMenu 
                :title="$t('explore')"
                :options="[
                  { label: t('findMusic.label'), path: '/bands', roles: ['all'] },
                  { label: t('findRestaurants.label'), path: '/restaurants', roles: ['all'] }                ]"
              />
              <MenubarSeparator class="mx-2 mb-4"/>
              <!-- Pricing Section -->
              <NuxtLink to="/pricing/promotions" class="font-bold text-md">
                <MenubarItem class="font-bold text-md">
                  {{$t('pricing')}}
                </MenubarItem>
              </NuxtLink>
              <MenubarSeparator class="mx-2 mb-4"/>
              <!-- Help Section -->
               <DetailsItemMenu 
                :title="$t('help')"
                :options="[
                  { label: t('helping.label'), path: '/help/general', roles: ['all'] },
                  { label: t('contactUs.label'), path: '/contact', roles: ['all'] }                ]"
              />
              <MenubarSeparator class="mx-2 mb-4"/>
              <!-- Dashboard Section -->
              <NuxtLink  v-if="userStore?.isAuthenticated" to="/pricing" class="font-bold text-md">
                <MenubarItem  class="font-bold text-md">
                  {{$t('dashboard')}}
                </MenubarItem>
              </NuxtLink>
              <MenubarSeparator v-if="userStore?.isAuthenticated" class="mx-2 mb-4"/>
              <!-- Languages Section -->
             <details class="custom-details p-2 cursor-pointer">
              <summary class="font-bold hover:text-primary">
                <div class="flex items-center justify-between">
                  {{ $t('languages') }}
                  <ChevronDown size="16" class="icon-tabler-chevron-down" />
                </div>
              </summary>
              <LangSelectorBurgerMenu />
            </details>
              <MenubarSeparator class="mx-2 mb-4" />
              <!-- Logout Section -->
              <AuthenticationBurgerMenu />
              <MenubarSeparator class="mx-2 mb-4"/>
              <div class="flex w-full justify-end pr-6 ">
                <ThemeSwitcher />
              </div>
            </div>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>     
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { AlignJustify, X, ChevronDown } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const { t } = useI18n()
const userStore = useUserStore()
const isAdmin = computed(() => userStore?.userData?.role === 'admin')


// Función para alternar el menú
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Función para cerrar el menú manualmente
const closeMenuManually = () => {
  isMenuOpen.value = false
}

</script>

<style scope>
.data-[state=open] {
  background-color: transparent !important;
}

.data-[state=open] .lucide {
  fill: white !important; 
}

[data-radix-popper-content-wrapper] {
  transform: auto !important; 
}

.custom-details summary {
  list-style: none !important; 
}

.custom-details summary::-webkit-details-marker {
  display: none; /* Para navegadores WebKit */
}

.custom-details[open] .icon-tabler-chevron-down {
  transform: rotate(180deg); /* Rota el ícono cuando se abre */
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  [data-radix-popper-content-wrapper] {
    transform: translate(0px, 0px) !important;
  }
}

</style>