<template>
  <details class="custom-details p-2 cursor-pointer">
    <summary class="font-bold hover:text-primary">
      <div class="flex items-center text-lg justify-between">
        {{ title }}
        <ChevronDown size="16" class="icon-tabler-chevron-down" />
      </div>
    </summary>
    <div class="flex flex-col gap-1 ml-2 mt-2 text-sm">
        <NuxtLink v-for="option in options" :key="option" :to="option.path">
          <div v-if="checkRole(option.roles)">{{ option.label }}</div>
        </NuxtLink>
    </div>
  </details>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'
const userStore = useUserStore()

const props = defineProps({
  title: {
    type: String
  },
  options: {
    type: Array
  }
})

const checkRole = (roles) => {
  return roles.filter(option => option === userStore.userData?.role || option === 'all').length > 0
}


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
