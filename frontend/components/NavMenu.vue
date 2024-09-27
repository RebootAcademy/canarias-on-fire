<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <!-- EXPLORE SECTION -->
        <NavigationMenuTrigger class="bg-transparent text-secondary hover:bg-gray hover:text-secondary  active:text-primary after:bg-transparent before:bg-orange-600">
          {{ $t('explore') }}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-6 bg-background border-whiteGray text-secondary md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
            <li>
              <div class="mb-2 text-lg font-medium text-primary">
                 {{ $t('events') }}
               </div>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/events"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none ">
                    {{ $t('findEvents.label')}} 
                  </div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{ $t('findEvents.subtext')}}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
              <NavigationMenuLink as-child v-if="validateRole(['admin', 'company'], userRole)">
                <NuxtLink
                  to="/promotions"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary  focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('findPromotions.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{  $t('findPromotions.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
              <NavigationMenuLink as-child v-if="validateRole(['admin', 'company'], userRole)">
                <button
                  @click="checkLogin"
                  variant="ghost"
                  class="text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('eventCreate.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground  ">
                    {{  $t('eventCreate.subtext') }}
                  </p>
                </button>
              </NavigationMenuLink>
              <NavigationMenuLink as-child v-if="validateRole(['admin', 'company'], userRole)">
                <NuxtLink
                  to="/dashboard/events"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary  focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{ $t('myEvents.label')}}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{ $t('myEvents.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li>
              <div class="mb-2 text-lg font-medium text-primary">
                 {{ $t('articles') }}
               </div>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/articles"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('findArticles.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{  $t('findArticles.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
              <NavigationMenuLink as-child v-if="isAdmin">
                <NuxtLink
                  to="/articles/create"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{ $t('createArticles.label')}}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                   {{ $t('createArticles.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
              <NavigationMenuLink as-child v-show="isAdmin">
                <NuxtLink
                  to="/dashboard/articles"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none"> {{  $t('manageArticles.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{ $t('manageArticles.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li>
               <div class="mb-2 text-lg font-medium  text-primary">
                 {{ $t('bands') }}
               </div>
               <NavigationMenuLink as-child >
                <NuxtLink
                  to="/bands"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none"> {{  $t('findMusic.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{ $t('findMusic.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li>
               <div class="mb-2 text-lg font-medium text-primary">
                 {{ $t('restaurant') }}
               </div>
               <NavigationMenuLink as-child >
                <NuxtLink
                  to="/restaurants"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none "> {{  $t('findRestaurants.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{ $t('findRestaurants.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      
      <!-- HELP SECTION -->
      <NavigationMenuItem >
        <NavigationMenuTrigger class="bg-transparent text-secondary hover:text-secondary hover:bg-gray before:bg-orange-600">
          {{ $t('help') }}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-6 bg-background border-1 border-white text-secondary md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/help/general"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('helping.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{  $t('helping.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
             <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/contact"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('contactUs.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                    {{  $t('contactUs.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <!-- PRICING SECTION -->
      <NavigationMenuItem >
        <NavigationMenuTrigger class="bg-transparent text-secondary hover:bg-gray hover:text-secondary before:bg-orange-600">
          {{ $t('pricing') }}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-6 bg-background text-secondary border-1 border-white md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/pricing"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray focus:bg-primary focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('princingNav.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{  $t('princingNav.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu> 

</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
const userStore = useUserStore()
const userRole = computed(() => userStore.userData?.role)
const auth0 = ref(null)
const route = useRouter()
const isAdmin = userStore.userData?.role === 'admin'
const isLogged = userStore.isAuthenticated

auth0.value = useAuth0()

const checkLogin = async () => {
  if (!userStore.isAuthenticated) {
    if (auth0.value) {
      await auth0.value.loginWithRedirect()
    }
  } else {
    route.push('/events/create')
  }
}
</script>

<style scoped>
button[data-state="open"] {
  background-color: rgba(125, 125, 125, 0.20); 
}
</style>