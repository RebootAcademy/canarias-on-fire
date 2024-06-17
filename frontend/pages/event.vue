<template>
  <div class="flex w-full h-full">
    <div class="bg-blue-900 w-1/2"></div>
    <div class="bg-blue-100 w-1/2 p-4">

      <header class="text-lg font-bold">Create a new Event</header>

      <div class="flex flex-col mt-4 gap-4">
        <div class="flex flex-col gap-2">
          <div class="font-semibold">Select category</div>
          <div class="flex gap-2">
            <Badge 
              v-for="category in categories"
              :key="category.id"
              variant="secondary"
              class="p-2 px-4"
            >{{ category.name }}</Badge>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="font-semibold">Event info</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const { data, error } = await useAsyncData('categories', () => $fetch(`${config.public.apiBaseUrl}/categories`, {
  method: 'GET'
})) 

if (error.value) {
  console.error('Error geting categories from database:', error.value)
} else {
  console.log('Categories fetched from databse', data.value)
}

const categories = data.value?.result || []

/* const { data: discounts, pending } = await useAsyncData('cart-discount', async () => {
  const [coupons, offers] = await Promise.all([
    $fetch('/cart/coupons'),
    $fetch('/cart/offers')
  ])

  return { coupons, offers }
}) */

</script>

