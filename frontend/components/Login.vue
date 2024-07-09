<template>
  <div class="h-full w-full flex justify-center">
    <div class="w-1/3 h-80 bg-red-300">
      <h1>Login Page</h1>
      <button @click="login">Log in</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

definePageMeta({
  layout: 'without-navbar'
})

useHead({
  title: 'Login'
})

const { loginWithRedirect } = useAuth0()

const login = () => {
  loginWithRedirect()
}

</script>