<template>
  <div v-if="!accepted" class="cookie-banner">
    <div class="flex flex-col items-center justify-evenly h-full">
      <img src="/cookie.png" alt="Cookie banner" class="absolute w-10 md:w-14 top-[-20px] md:top-[-30px]" />
      <div>
        <p>
          {{ $t('banner.description') }}
        </p>
        <p>
          {{ $t('banner.see')}}
          <NuxtLink to="/cookies-policy" target="_blank" class="underline"
            >{{ $t('banner.policy').toLowerCase()}}</NuxtLink
          >.
        </p>
      </div>
      <div class="flex w-full justify-center items-center mt-4 gap-8">
        <button @click="acceptCookies" class="font-bold underline acceptText text-green-700 hover:text-primary">{{ $t('banner.accept') }}</button>
        <button @click="declineCookies">{{ $t('banner.decline') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const { t } = useI18n()
const accepted = ref(true)

onMounted(() => {
  checkCookieConsent()
}) 



const checkCookieConsent = () => {
  const consent = localStorage.getItem('cookie-consent')
  if (consent) {
    accepted.value = true
  } else {
    accepted.value = false
  }
}

const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'true')
  accepted.value = true
}

const declineCookies = () => {
  localStorage.setItem('cookie-consent', 'false')
  accepted.value = true
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 200px;
  background: #fcf9f9;
  color: rgb(36, 35, 35);
  border-top: 1px solid #030303;
  padding: 12px;
  text-align: center;
}

</style>
