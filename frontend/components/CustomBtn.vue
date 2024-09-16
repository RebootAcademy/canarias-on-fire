<template>
    <div 
      v-if="!withoutGradient"
      @click="action"
      class="cursor-pointer bg-primary-gradient p-0.5 rounded-md"
    >
      <button :class="['bg-black w-full h-full p-2 px-4 rounded-md hover:bg-transparent', extraStyles || '']">
        <span class="text-center font-semibold text-white">{{ title }}</span>
      </button> 
      <slot />
    </div>

    <div v-else>
      <button
        @click="action"
        :class="['', extraStyles || '']"
      >
        <span class="text-center font-semibold p-3 px-6 bg-black w-full h-full rounded-md hover:bg-transparent  text-white border-2 border-white">{{ title }}</span>
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
    withoutGradient:{
      type: Boolean,
      default: false
    }
  });
  </script>
  