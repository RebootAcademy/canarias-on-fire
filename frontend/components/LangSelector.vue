<template>
  <div>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            class=" bg-transparent text-secondary hover:bg-gray active:bg-primary focus:bg-transparent"
          >
            <NuxtLink
              :to="switchLocalePath(currentLocale)"
              class="flex items-center bg-transparent text-secondary px-3 py-2 rounded-md"
            >
              <NuxtImg
                :src="getFlagSrc(currentLocale)"
                width="20"
                class="mr-2"
              />
              {{ currentLocale.toUpperCase() }}
            </NuxtLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent class="bg-background text-secondary">
            <ul class="p-2">
              <li v-for="lang in languages" :key="lang.code">
                <NavigationMenuLink as-child>
                  <button
                    @click="setLocale(lang.code)"
                    class="flex items-center xs:w-20 xs:px-1 sm:w-32 px-3 py-2 text-sm font-normal rounded-md hover:bg-gray active:bg-primary"
                    :class="currentLocale === lang.code ? 'bg-gray' : ''"
                  >
                    <NuxtImg :src="lang.flag" :alt="lang.name" width="20" class="mr-2 xs:w-4 sm:w-6" />
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
const { locale, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = computed(() => locale.value)
const localeReady = ref(false)
const {t} = useI18n()


const languages = computed(() => [
  { code: 'es', name: t('languagesOptions.es'), flag: 'espana.png' },
  { code: 'en', name: t('languagesOptions.en'), flag: 'estados-unidos.png' },
])

const getFlagSrc = (code) => {
  return languages.value.find((lang) => lang.code === code)?.flag || 'espana.png'
}

onMounted(() => {
  if (locale.value) {
    localeReady.value = true
  }
})
</script>

<style scoped>
button[data-state='open'] {
  background-color: rgba(125, 125, 125, 0.2);
}
</style>
