<template>
 <div
  v-if="!withoutGradient"
  @click="action"
  class="cursor-pointer p-0.5 rounded-md"
  :class="inverse ? 'bg-white' : 'bg-primary-gradient'"
>
  <button
    :class="[
      'w-full h-full p-2 px-4 rounded-md transition-all duration-200 ease-in-out',
      inverse
        ? 'bg-primary-gradient text-background hover:bg-white hover:text-secondary'
        : 'bg-background text-secondary hover:bg-white hover:text-primary',
      extraStyles || ''
    ]"
  >
    <span class="text-center font-semibold">{{ title }}</span>
  </button>
  <slot />
</div>



  <div v-else>
    <button @click="action" :class="['', extraStyles || '']">
      <span
        class="text-center font-semibold p-3 px-6 bg-black w-full h-full rounded-md hover:bg-transparent text-white border-2 border-white"
        >{{ title }}</span
      >
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  action: {
    type: Function,
    default: () => {},
  },
  extraStyles: {
    type: String,
    default: '',
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  withoutGradient: {
    type: Boolean,
    default: false,
  },
})
</script>
