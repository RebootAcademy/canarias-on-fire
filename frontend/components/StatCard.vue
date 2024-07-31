<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <component :is="icon" class="w-5 h-5 text-gray-400" />
    </div>
    <p class="text-3xl font-bold">{{ value }}</p>
    <p :class="`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`">
      {{ change }} from last month
    </p>
  </div>
</template>

<script setup>
import { DollarSign, Users, ShoppingCart, Activity } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: String,
  change: String,
  icon: {
    type: String,
    default: 'DollarSign'
  }
})

const iconMap = {
  'dollar-sign': DollarSign,
  'users': Users,
  'shopping-cart': ShoppingCart,
  'activity': Activity
}

const icon = computed(() => iconMap[props.icon] || DollarSign)
</script>