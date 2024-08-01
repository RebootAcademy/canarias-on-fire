<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger class="bg-transparent text-white">
          Events
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
            <li class="row-span-3 flex flex-col justify-end px-2 py-3">
              <img src="https://www.radix-vue.com/logo.svg" class="h-6 w-6">
              <div class="mb-2 mt-4 text-lg font-medium">
                evente
              </div>
              <p class="text-sm leading-tight text-muted-foreground">
                Find the best plans on the islands with our website.
              </p>
            </li>
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/events"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">Find events</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Search and discover events near you or in your area of interest.
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/events/create"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">Create events</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Plan and organize your own events.
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/dashboard/events"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">My events</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    View and manage all the events you have created.
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <NavigationMenuTrigger class="bg-transparent text-white">
          Articles
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="flex gap-3 p-4 w-96">
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/articles/create"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">Create articles</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Plan and organize your own events.
                  </p>
                </NuxtLink>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink as-child>
                <NuxtLink
                  to="/dashboard/articles"
                  class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">Manage articles</div>
                  <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Manage your website's articles.
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

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

</script>