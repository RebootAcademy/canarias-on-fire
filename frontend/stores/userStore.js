import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null
  }),
  actions: {
    setUser(data) {
      this.userData = data
    },
    clearUserId() {
      this.userData = null
    },
    async fetchAndSetUser(email) {
      try {
        const { data } = await useFetch(`http://localhost:8080/api/users/current/${email}`)
        if (data.value) {
          this.setUser(data.value)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
  },
  persist: {
    storage: persistedState.localStorage,
  },
})