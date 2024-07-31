import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscriptionStore', {
  state: () => ({
    subscriptions: [],
    selectedPlan: null,
  }),
  actions: {
    setSelectedPlan(plan) {
      this.selectedPlan = plan
    },

    async fetchSubscriptions() {
      try {
        const data = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/subscriptions`)
        this.subscriptions = data.result
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      }
    },

    getBasicSubscription() {
      return this.subscriptions.find(sub => sub.name === 'basic')
    }
  },
})