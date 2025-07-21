<template>
  <!-- Login Warning Modal -->
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
  >
    <div
      class="bg-background p-6 rounded-2xl shadow-2xl max-w-[22rem] w-full text-center animate-fade-in border-2 border-primary/70"
    >
      <h2 class="text-xl font-bold mb-2">Area destinada a Empresas y Promotores</h2>
      <p class="mb-4 text-base text-secondary">
        El registro está pensado <b>únicamente</b> para empresas, promotores o
        entidades que quieran publicar eventos o promocionarse. <br /><br />
        Si solo quieres ver eventos,
        <span class="font-semibold">no necesitas registrarte</span>.
      </p>
      <div class="flex justify-center gap-4 mt-4">
        <button
          @click="$emit('continuar')"
          class="px-4 py-2 rounded-lg bg-primary text-background font-bold hover:bg-primary-gradient transition"
        >
          Continuar
        </button>
        <button
          @click="$emit('cancelar')"
          class="px-4 py-2 rounded-lg bg-muted text-white font-semibold hover:bg-muted/80 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
defineEmits(['continuar', 'cancelar'])
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.25s;
}
</style>
