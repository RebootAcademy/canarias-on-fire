<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child class="bg-transparent border-none">
      <Button >
        <Bell class="color-white" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-80">
      <DropdownMenuLabel class="flex items-center justify-between">
        Notifications
        <span class="text-xs font-normal">Clear all</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="items-start">
        <div class="bg-gray-100 rounded-3xl mr-2">
          <Megaphone class="w-10 h-10 p-2" />
        </div>
        <div class="flex flex-col items-start">
          <p>Your event Coconut festival has received changes from an administrator. More detailed information will be sent to you via email.</p>
          <p class="text-xs opacity-60">System - Friday 11:45 A.M.</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <div class="bg-gray-100 rounded-3xl mr-2">
          <ShieldAlert class="w-10 h-10 p-2" />
        </div>
        <div class="flex flex-col items-start">
          The event Coconut Festival will be held soon! Don't forget to attend!
          <p class="text-xs opacity-60">La Wawa Productions - Friday 11:45 A.M.</p>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { Bell, Megaphone, ShieldAlert } from 'lucide-vue-next'

</script>