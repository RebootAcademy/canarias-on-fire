<template>
  <ul class="px-2 mt-2">
    <li v-for="lang in languages" :key="lang.code">
      <NavigationMenuLink as-child>
        <div
          @click="setLocale(lang.code)"
          class="flex items-center xs:w-20 xs:px-1 sm:w-32 px-3 py-2 text-sm rounded-md hover:text-primary"
          :class="locale === lang.code ? 'font-bold' : 'font-normal'"
        >
          <NuxtImg :src="lang.flag" width="20" class="mr-2 xs:w-4 sm:w-6 text-secondary" />
          <span class="text-secondary">{{ lang.name }}</span>
        </div>
      </NavigationMenuLink>
    </li>
  </ul>
</template>

<script setup>
const { locale, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const currentLocale = ref(locale.value)
const {t} = useI18n()

const languages = [
  { code: 'es', name: t('languagesOptions.es'), flag: 'espana.png' },
  { code: 'en', name: t('languagesOptions.en'), flag: 'estados-unidos.png' },
]

const getFlagSrc = (code) => {
  return languages.find((lang) => lang.code === code)?.flag || 'espana.png'
}

watchEffect(() => {
  currentLocale.value = locale.value
})
</script>
