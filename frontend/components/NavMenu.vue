<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger class="bg-transparent text-white">
          {{ $t('events') }}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
            <li class="row-span-3 flex flex-col justify-end px-2 py-3">
              <img src="https://www.radix-vue.com/logo.svg" class="h-6 w-6">
              <div class="mb-2 mt-4 text-lg font-medium">
                {{ $t('events') }}
              </div>
              <p class="text-sm leading-tight text-muted-foreground">
                {{ $t('eventText') }}
              </p>
            </li>
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/events"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{ $t('findEvents.label')}} </div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{ $t('findEvents.subtext')}}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink as-child>
                <button
                  @click="checkLogin"
                  variant="ghost"
                  class="text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('eventCreate.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{  $t('eventCreate.subtext') }}
                  </p>
                </button>
              </NavigationMenuLink>
            </li>
            <li v-show="isLogged">
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/dashboard/events"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{ $t('myEvents.label')}}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{ $t('myEvents.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <NavigationMenuTrigger class="bg-transparent text-white">
          {{ $t('articles') }}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="flex gap-3 p-4 w-96">
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/articles"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{  $t('findArticles.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{  $t('findArticles.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li v-show="isAdmin">
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/articles/create"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">{{ $t('createArticles.label')}}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                   {{ $t('createArticles.subtext') }}
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li v-show="isAdmin">
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/dashboard/articles"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none"> {{  $t('manageArticles.label') }}</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {{ $t('manageArticles.subtext') }}
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

const auth0 = ref(null)
const route = useRouter()

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

const isAdmin = userStore.userData?.role === 'admin'
const isLogged = userStore.userData
</script>