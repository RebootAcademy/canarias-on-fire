<template>
  <div class="flex gap-2">
    <Button 
      @click="setLocale('es')" 
      :variant="locale === 'es' ? 'secondary' : 'primary'"
    >
      <NuxtImg src="espana.png" width="20" class="m-1" />
      ES
    </Button>
    <Button 
      @click="setLocale('en')" 
      :variant="locale === 'en' ? 'secondary' : 'primary'"
    >
      <NuxtImg src="estados-unidos.png" width="20" class="m-1" />
      EN
    </Button>
  </div>
</template>

<script setup>
const { locale, setLocale } = useI18n()
const currentLocale = ref(locale.value)

watchEffect(() => {
  currentLocale.value = locale.value
})
</script>
