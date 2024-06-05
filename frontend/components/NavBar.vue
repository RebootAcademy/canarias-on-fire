<template>
  <div class="h-16 bg-blue-400 flex items-end justify-between px-4 py-2">
    <div class="text-2xl font-extrabold text-white">
      <NuxtLink to="/">
        Evently<span class="text-sm text-black">.com</span>
      </NuxtLink>
    </div>
    <div class="text-sm font-bold">
      <NuxtLink to="/dashboard">
        <Avatar>
          <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { Avatar } from '@/components/ui/avatar'
</script>