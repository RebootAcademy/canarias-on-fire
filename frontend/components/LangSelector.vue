<template>
  <div>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            class=" bg-transparent text-white hover:bg-gray active:bg-primary focus:bg-transparent"
          >
            <NuxtLink
              :to="switchLocalePath(currentLocale)"
              class="flex items-center bg-transparent text-white px-3 py-2 rounded-md"
            >
              <NuxtImg
                :src="getFlagSrc(currentLocale)"
                width="20"
                class="mr-2"
              />
              {{ currentLocale.toUpperCase() }}
            </NuxtLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent class="bg-[#1C1F1F] text-white">
            <ul class="p-2">
              <li v-for="lang in languages" :key="lang.code">
                <NavigationMenuLink as-child>
                  <button
                    @click="setLocale(lang.code)"
                    class="flex items-center xs:w-20 xs:px-1 sm:w-32 px-3 py-2 text-sm font-normal rounded-md hover:bg-gray"
                    :class="locale === lang.code ? 'bg-gray' : ''"
                  >
                    <NuxtImg :src="lang.flag" width="20" class="mr-2 xs:w-4 sm:w-6" />
                    {{ lang.name }}
                  </button>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
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
]

const getFlagSrc = (code) => {
  return languages.find((lang) => lang.code === code)?.flag || 'espana.png'
}

watchEffect(() => {
  currentLocale.value = locale.value
})
</script>

<style scoped>
button[data-state='open'] {
  background-color: rgba(125, 125, 125, 0.2);
}
</style>
