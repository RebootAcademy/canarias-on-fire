<template>
      <!-- Sidebar -->
      <aside class="flex flex-wrap items-center lg:flex-col lg:w-64 p-4 lg:mt-8 ">
        <nav class="flex w-full ">
          <ul class=" flex flex-wrap gap-2   lg:gap-0 items-center justify-center lg:flex-col lg:items-stretch lg:w-full">
            <li v-for="(link, idx) in links" :key="idx" >
                <NuxtLink 
                    v-show="validateRole(link.roles, userRole)"
                    :to="link.path" 
                    active-class="border border-primary" 
                    class="block py-2 px-4 rounded-md bg-gray mb-3">
                    {{ link.label }}
                </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>
    </template>
<script setup>
/**
 * props.links structure example : [ { label: 'Events', path: '/events', roles: ['admin', 'company'] } ]
 */
const props = defineProps({
    links: {
        type: Array,
        required: true
    },
    userRole: {
        type: String,
        required: true
    }
})


</script>