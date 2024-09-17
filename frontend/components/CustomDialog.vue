<template>
  <Dialog>
    <DialogTrigger as-child>
      <span class="text-sm italic underline text-blue-400 cursor-pointer hover:text-primary">{{title}}</span>
    </DialogTrigger>
    <DialogScrollContent class="xs:max-w-[90%] sm:max-w-[60%] lg:max-w-[90%] bg-black rounded  border-primary">
      <slot/>
    </DialogScrollContent>
  </Dialog>
</template>

<script setup>
    const props = defineProps({
      title: String
    })
</script>