<template>
  <div class="flex flex-col items-center p-6">
    <hr class="w-full border-t border-gray-300 mb-4" />
    <div class="flex items-center justify-center w-full px-4">
      <p class="text-xl font-bold text-center">{{  $t('counter') }} <span class="">{{ props.events.length}}</span></p>
    </div>
    <hr class="w-full border-t border-gray-300 mt-4" />
  </div>
</template>

<script setup>
const props = defineProps({
  events: Array
})

 console.log(props.events.length)
</script>
