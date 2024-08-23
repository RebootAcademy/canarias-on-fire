import { defineStore } from 'pinia'

export const useSubscriptionStore = defineStore('subscriptionStore', {
  state: () => ({
    subscriptions: [],
    selectedPlan: null,
    status: null,
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
    },

    async createSubscription(companyId, planId) {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/subscriptions/create/${companyId}`, {
          method: 'POST',
          body: JSON.stringify({ planId }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.success && response.sessionUrl) {
          return { 
            success: true, 
            sessionUrl: response.sessionUrl 
          }
        } else if (response.success && response.subscription) {
          return { 
            success: true, 
            subscription: response.subscription 
          }
        }
        return { 
          success: false, 
          message: response.error || 'Failed to create subscription' 
        }
      } catch (error) {
        return { 
          success: false, 
          message: error.message 
        }
      }
    },

    async upgradeSubscription(companyId, newPlanId) {
      console.log('upgradeSubscription called with companyId:', companyId, 'and newPlanId:', newPlanId)
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/subscriptions/upgrade/${companyId}`, {
          method: 'PATCH',
          body: JSON.stringify({ newPlanId }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log('Response from backend:', data.value)

        if (data.value && data.value.success) {
          console.log('Upgrade successful, returning sessionUrl:', data.value.sessionUrl)
          return { 
            success: true, 
            sessionUrl: data.value.sessionUrl 
          }
        } else {
          console.error('Upgrade failed:', data.value?.error)
          throw new Error(data.value?.error || 'Failed to upgrade subscription')
        }
      } catch (error) {
        console.error('Error in upgradeSubscription:', error)
        return { success: false, error: error.message }
      }
    },

    async downgradeSubscription(companyId, newPlanId) {
      const { data, error } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/subscriptions/downgrade/${companyId}`, {
        method: 'PATCH',
        body: JSON.stringify({ newPlanId }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (error.value) {
        throw new Error(error.value.message || 'Failed to downgrade subscription')
      }

      if (data.value && data.value.success) {
        // Update the subscription status in the store
        this.status = 'downgrading'
        
        return {
          success: true,
          nextBillingDate: data.value.nextBillingDate,
          newPlan: data.value.newPlan,
        }
      } else {
        throw new Error(data.value?.error || 'Failed to downgrade subscription')
      }
    },

    async cancelSubscription(companyId) {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/subscriptions/cancel/${companyId}`, {
          method: 'POST'
        })
        if (response.success) {
          this.selectedPlan = null
          this.status = 'canceling'
          return { success: true }
        } else {
          return { success: false, message: response.message }
        }
      } catch (error) {
        console.error('Error canceling subscription:', error)
        return { success: false, message: error.message }
      }
    },

    async reactivateSubscription(companyId) {
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/subscriptions/reactivate/${companyId}`, {
          method: 'POST'
        })
        if (response.success) {
          this.selectedPlan = response.plan
          this.status = 'active'
          return { success: true }
        } else {
          return { success: false, message: response.message }
        }
      } catch (error) {
        console.error('Error reactivating subscription:', error)
        return { success: false, message: error.message }
      }
    },
  },
})