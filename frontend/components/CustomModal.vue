<template>
  <dialog
    ref="modal"
    @click="onClickOutside"
    @close="emitClose"
    class="bg-background border-2 border-secondary rounded-md p-6 text-secondary min-w-[330px] md:min-w-[400px] md:max-w-[600px] max-h-[90vh] overflow-auto"
  >
    <div class="flex flex-col gap-2">
      <div class="w-full flex justify-end">
        <X class="hover:text-primary cursor-pointer" @click="closeModal" />
      </div>
      <slot />
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: String,
  description: String,
  btnTitle: String,
  btnAction: Function,
})

const modal = ref(null)
const emit = defineEmits(['update:open'])

// Función para cerrar el modal y emitir el evento
function closeModal() {
  modal.value.close()
  emit('update:open', false) // Emitir evento para actualizar el estado en el padre
}

// Función que detecta cuando el modal se cierra de forma manual
function emitClose() {
  emit('update:open', false) // Emitir evento para actualizar el estado en el padre
}

// Detectar clic fuera del modal
function onClickOutside(event) {
  if (event.target === modal.value) {
    closeModal()
  }
}

// Watch para abrir o cerrar el modal según la prop `open`
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      modal.value.showModal()
    } else {
      closeModal()
    }
  }
)
</script>
