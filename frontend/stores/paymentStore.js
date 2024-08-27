import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('paymentStore', {
  state: () => ({
    payments: [],
    selectedPayment: null,
  }),
  actions: {
    setSelectedPayment(payment) {
      this.selectedPayment = payment
    },

    async fetchPayments() {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/payments`)
        this.payments = data.value.payments
      } catch (error) {
        console.error('Error fetching payments:', error)
      }
    },

    async createPayment(companyId, paymentData) {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/payments/create/${companyId}`, {
          method: 'POST',
          body: JSON.stringify(paymentData),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (data.value.success && data.value.sessionUrl) {
          return { 
            success: true, 
            sessionUrl: data.value.sessionUrl 
          }
        } else if (data.value.success && data.value.payment) {
          return { 
            success: true, 
            payment: data.value.payment 
          }
        }
        return { 
          success: false, 
          message: data.value.error || 'Failed to create payment' 
        }
      } catch (error) {
        return { 
          success: false, 
          message: error.message 
        }
      }
    },
  },
})