<template>
  <div class="flex items-center w-full justify-between bg-white shadow-md rounded p-4 gap-20">
    <div class="text-sm">
      <p class="font-semibold text-gray-800">{{ event.eventName }}</p>
      <p class="text-gray-600">{{ event.place }}</p>
    </div>
    <div class="flex-shrink-0">
      <img
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        class="w-16 h-16 object-cover"
        alt="Event Image"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: Object
})


</script>