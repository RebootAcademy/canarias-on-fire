<template>
    <button
      @click="scrollToTop"
      class="fixed z-50 md:w-[65px] md:h-[65px] bottom-10 right-5 md:bottom-10 md:right-10 bg-primary text-background p-3 rounded-full shadow-lg"
      v-if="showScrollButton"
    >
      <ChevronUp class="mx-auto text-2xl" />
    </button>
</template>

<script setup>
import { ChevronUp } from 'lucide-vue-next';

import { ref, onMounted, onBeforeUnmount } from 'vue';

const showScrollButton = ref(false);

// Función para hacer scroll al principio
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Función para manejar el evento de scroll
const handleScroll = () => {
  showScrollButton.value = window.scrollY > 200; // Cambia este valor según lo necesites
};

// Agregar y quitar el event listener en los hooks de ciclo de vida
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
/* Estilos opcionales para el botón */
button {
  transition: opacity 0.3s ease;
}
</style>
