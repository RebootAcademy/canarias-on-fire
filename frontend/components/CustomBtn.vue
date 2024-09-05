<template>
    <div 
      @click="action"
      class="cursor-pointer bg-primary-gradient p-0.5 rounded-md"
    >
      <button :class="['bg-black w-full h-full p-2 px-4 rounded-md hover:bg-transparent', extraStyles || '']">
        <span class="text-center font-semibold text-white">{{ title }}</span>
      </button> 
      <slot />
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
  });
  </script>
  