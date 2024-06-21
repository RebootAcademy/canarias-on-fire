import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscriptionStore', {
  state: () => ({
    selectedPlan: null,
  }),
  actions: {
    setSelectedPlan(plan) {
      this.selectedPlan = plan
    },
  },
})