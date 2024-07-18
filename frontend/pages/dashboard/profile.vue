<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Profile</h2>
    <hr class="mb-4">
    <div v-if="isAuthenticated && user">
      <div class="flex items-center mb-4">
        <Avatar>
          <AvatarImage :src="user.picture" alt="User Avatar" />
          <AvatarFallback>{{ user.name?.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div class="ml-4">
          <h3 class="text-lg font-semibold">{{ user.name }}</h3>
        </div>
      </div>
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-700">Username</Label>
          <Input class="mt-1 block w-full" :modelValue="user.nickname" />
        </div>
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-700">Email</Label>
          <Input class="mt-1 block w-full" :modelValue="user.email" />
        </div>
        <Button>Update profile</Button>
      </form>
    </div>
    <div v-else>
      <p>Please log in to view your profile.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'User Profile'
})

const { user, isAuthenticated } = useAuth0()
</script>