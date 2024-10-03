<template>
  <div>
    <!-- <CustomModal 
      title="Password" 
      description="Change your password"
      btnTitle="Save"
      :btnAction="submitAction"
      v-model:open="isOpen"
    /> -->
    <CustomModal v-model:open="isOpen" >
      <p>Hola</p>
      <p>Descripción</p>
    </CustomModal>
    <p @click="isOpen = !isOpen">Open</p>
    <p>{{ isOpen }}</p>
  </div>
</template>

<script setup>
const isOpen = ref(false);



</script>