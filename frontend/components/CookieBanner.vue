<template>
  <div v-if="!accepted" class="cookie-banner">
    <p>
      Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra
      <a href="/politica-cookies" target="_blank">política de cookies</a>.
    </p>
    <button @click="acceptCookies">Aceptar</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const accepted = ref(false);

onMounted(() => {
  checkCookieConsent();
});

const checkCookieConsent = () => {
  const consent = localStorage.getItem('cookie-consent');
  if (consent) {
    accepted.value = true;
  }
};

const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'true');
  accepted.value = true;
};
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #333;
  color: white;
  padding: 15px;
  text-align: center;
}
</style>
