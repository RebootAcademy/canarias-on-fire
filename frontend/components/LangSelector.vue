<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger class="bg-transparent text-white hover:bg-black">
          <NuxtLink 
            :to="switchLocalePath(currentLocale)"
            class="flex items-center bg-transparent text-white px-3 py-2 rounded-md"
          >
            <NuxtImg :src="getFlagSrc(currentLocale)" width="20" class="mr-2" />
            {{ currentLocale.toUpperCase() }}
          </NuxtLink>
        </NavigationMenuTrigger>
        <NavigationMenuContent class="bg-white text-black">
          <ul class="p-2">
            <li v-for="lang in languages" :key="lang.code">
              <NavigationMenuLink as-child>
                <NuxtLink 
                  :to="switchLocalePath(lang.code)"
                  class="flex items-center w-32 px-3 py-2 text-sm font-normal rounded-md hover:bg-gray-100"
                  :class="locale === lang.code ? 'bg-gray-100' : ''"
                >
                  <NuxtImg :src="lang.flag" width="20" class="mr-2" />
                  {{ lang.name }}
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const { locale, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = ref(locale.value)

const languages = [
  { code: 'es', name: 'Español', flag: 'espana.png' },
  { code: 'en', name: 'English', flag: 'estados-unidos.png' },
  { code: 'de', name: 'Deutsch', flag: 'DE.png' }
]

const getFlagSrc = (code) => {
  return languages.find(lang => lang.code === code)?.flag || 'espana.png'
}

watchEffect(() => {
  currentLocale.value = locale.value
})
</script>