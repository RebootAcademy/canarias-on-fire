<template>
  <!-- Fondo oscuro detrás del modal -->
  <div
    v-if="openModal"
    @click="
      () => {
        closeModal()
        selectOption('promotions') // Al hacer clic fuera del modal, se cierra y se selecciona 'promotions'
      }"
    class="fixed inset-0 bg-black z-[60] bg-opacity-90"
  ></div>

  <!-- Modal principal centrado en la pantalla -->
  <div
    v-if="openModal"
    class="fixed flex justify-center items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]"
  >
    <!-- Contenedor interno del modal -->
    <div
      class="relative flex flex-col items-center justify-center gap-y-4 w-[100vw] xs:w-[70vw] max-w-[70vw]"
    >
      <!-- Lista de imágenes filtradas (excluyendo 'promotions') -->
      <img
        v-for="option in options.filter((opt) => opt.value !== 'promotions')"
        :key="option.value"
        class="cursor-pointer rounded-sm w-full"
        @click="selectOption(option.value)"  
        :src="option.image"
        alt=""
      />

      <!-- Botón de cierre (X) en la esquina superior derecha -->
      <div
        @click="
          () => {
            closeModal()
            selectOption('promotions') // Al cerrar manualmente también se selecciona 'promotions'
          }
        "
        class="absolute w-6 h-6 bg-primary top-[-22px] right-[-22px] flex justify-center items-center rounded-full cursor-pointer opacity-90"
      >
        <span class="font-bold opacity-60 text-background">X</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importación de helpers de Vue
import { defineProps, defineEmits } from 'vue'

// Declaración de eventos emitidos por el componente
const emit = defineEmits(['close', 'select'])

// Definición de las props que recibe el componente
const props = defineProps({
  openModal: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
})

// Función que emite la opción seleccionada y luego cierra el modal
const selectOption = (value) => {
  emit('select', value) // Enviar la opción al componente padre
  closeModal()          // Cierra el modal
}

// Función para cerrar el modal (emitir el evento 'close')
const closeModal = () => {
  emit('close')
}
</script>
