<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose your plan</h2>
      <p class="mt-4 text-lg text-gray-500">
        Find the perfect plan that suits your event needs. Whether you're organizing we have flexible options tailored for every occasion.
      </p>
    </div>
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center border rounded-lg shadow-sm p-6 pt-12">
        <h3 class=" text-lg leading-6 font-medium text-gray-900">Basic</h3>
        <div class="mt-4">
          <span class="text-4xl font-extrabold text-gray-900">0€</span>
          <span class="text-base font-medium text-gray-500"> / FREE</span>
        </div>
        <ul class="mt-6 space-y-4">
          <li class="flex items-start">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-3 text-base text-gray-700">Event Posting</p>
          </li>
          <!-- Repite el ítem según sea necesario -->
        </ul>
        <div class="mt-8">
          <button class="w-full bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg">GET STARTED</button>
        </div>
      </div>

      <div class="text-center border rounded-lg shadow-sm p-6 relative">
        <div class="absolute top-0 left-0 right-0 bg-black text-white text-center py-1 rounded-t-lg">Recommended option</div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-6">Platinum</h3>
        <div class="mt-4">
          <span class="text-4xl font-extrabold text-gray-900">29,99€</span>
          <span class="text-base font-medium text-gray-500"> / MO</span>
        </div>
        <ul class="mt-6 space-y-4">
          <li class="flex items-start">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-3 text-base text-gray-700">Event Posting</p>
          </li>
          <!-- Repite el ítem según sea necesario -->
        </ul>
        <div class="mt-8">
          <button class="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg">GET STARTED</button>
        </div>
      </div>

      <div class="text-center border rounded-lg shadow-sm p-6 pt-12">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Gold</h3>
        <div class="mt-4">
          <span class="text-4xl font-extrabold text-gray-900">14,99€</span>
          <span class="text-base font-medium text-gray-500"> / MO</span>
        </div>
        <ul class="mt-6 space-y-4">
          <li class="flex items-start">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-3 text-base text-gray-700">Event Posting</p>
          </li>
          <!-- Repite el ítem según sea necesario -->
        </ul>
        <div class="mt-8">
          <button class="w-full bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg">GET STARTED</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSubscriptionStore } from '../stores/subscriptionStore'

const subscriptionStore = useSubscriptionStore()

const plans = [
  {
    name: 'Basic',
    price: 0,
    color: 'blue',
    url: 'https://buy.stripe.com/test_7sIg158j4eSI24gdQQ',
    features: [
      { text: 'Your Text Here', included: true },
      { text: 'Sample Text Here', included: true },
      { text: 'Text Here', included: false },
      { text: 'Your Sample Text Here', included: false },
      { text: 'Your Text Here', included: true },
      { text: 'Your Text Input', included: false },
    ],
  },
  {
    name: 'Standard',
    price: 15,
    color: 'blue',
    url: 'https://buy.stripe.com/test_7sIg158j4eSI24gdQQ',
    features: [
      { text: 'Your Text Here', included: true },
      { text: 'Sample Text Here', included: true },
      { text: 'Text Here', included: true },
      { text: 'Your Sample Text Here', included: true },
      { text: 'Your Text Here', included: true },
      { text: 'Your Text Input', included: true },
    ],
  },
  {
    name: 'Premium',
    price: 25,
    color: 'blue',
    url: '',
    features: [
      { text: 'Your Text Here', included: true },
      { text: 'Sample Text Here', included: true },
      { text: 'Text Here', included: true },
      { text: 'Your Sample Text Here', included: true },
      { text: 'Your Text Here', included: true },
      { text: 'Your Text Input', included: true },
    ],
  },
]

const selectPlan = (planName) => {
  subscriptionStore.setSelectedPlan(planName)
  console.log(planName)
}
</script>

<style scoped>

</style>