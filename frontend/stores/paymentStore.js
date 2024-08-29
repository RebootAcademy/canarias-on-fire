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

    async assignPaymentToEvent(companyId, paymentData) {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/payments/assign/${companyId}`, {
          method: 'POST',
          body: JSON.stringify(paymentData),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (data.value && data.value.success) {
          return {
            success: true,
            sessionUrl: data.value.sessionUrl,
            event: data.value.event
          }
        } else {
          return {
            success: false,
            error: data.value?.error || 'Failed to assign payment to event'
          }
        }

      } catch (error) {
        console.error('Error in assignPaymentToEvent:', error)
        return { success: false, error: error.message }
      }
    },

    async createPaymentSession(companyId, paymentData) {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/payments/create-session/${companyId}`, {
          method: 'POST',
          body: JSON.stringify(paymentData),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (data.value && data.value.success) {
          return {
            success: true,
            sessionUrl: data.value.sessionUrl
          }
        } else {
          return {
            success: false,
            error: data.value?.error || 'Failed to create payment session'
          }
        }
      } catch (error) {
        console.error('Error in createPaymentSession:', error)
        return { success: false, error: error.message }
      }
    },
  },
})