<template>
  <div class="flex flex-col items-center">
    <h2 class="text-3xl font-bold mb-8">Our Pricing Table</h2>
    <div class="flex justify-center gap-8">
      <div v-for="plan in plans" :key="plan.name" class="bg-white shadow-md rounded-lg p-6 w-64">
        <div :class="`bg-${plan.color}-500 text-white text-center py-2 rounded-t-lg`">
          <h3 class="text-xl font-semibold">{{ plan.name }}</h3>
          <p class="text-4xl font-bold mt-2">
            <span v-show="plan.price !== 0">$</span>
            {{ plan.price === 0 ? 'Free' : plan.price }}
          </p>
        </div>
        <ul class="mt-4 mb-6">
          <li v-for="(feature, index) in plan.features" :key="index" class="flex items-center mb-2">
            <span :class="feature.included ? 'text-green-500' : 'text-red-500'">
              <i :class="feature.included ? 'fas fa-check' : 'fas fa-times'"></i>
            </span>
            <span class="ml-2">{{ feature.text }}</span>
          </li>
        </ul>
        <NuxtLink :to="plan.url">
          <button @click="selectPlan(plan.name)" class="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-400">
            Buy Now
          </button>
        </NuxtLink>
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