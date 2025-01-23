<template>
    <details class="custom-details p-2 cursor-pointer w-full">
        <summary>
        <div class="flex  w-full items-center justify-between font-bold">
        {{ question.question }}
        <ChevronDown size="16" class="icon-tabler-chevron-down" />
      </div>
        </summary>
        <p class="mt-4" v-html="question.answer">
        </p>
    </details>
    <hr class="w-full border-t border-gray-300 my-4"/>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'


const props = defineProps({
    question: {
        type: Object,
        required: true
    }
})

console.log('q', props.question.browsers)

</script>

<style scoped>
.custom-details summary {
  list-style: none !important; 
}

.custom-details summary::-webkit-details-marker {
  display: none; /* Para navegadores WebKit */
}

.custom-details[open] .icon-tabler-chevron-down {
  transform: rotate(180deg); /* Rota el ícono cuando se abre */
  transition: transform 0.3s ease;
}
</style>