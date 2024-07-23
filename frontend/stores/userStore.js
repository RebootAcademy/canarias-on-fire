import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    isAuthenticated: false,
    users: [],
    searchQuery: '',
    isLoading: false,
    error: null
  }),

  actions: {
    setUser(data) {
      this.userData = data.result
      this.isAuthenticated = true
    },
    clearUserId() {
      this.userData = null
      this.isAuthenticated = false
    },
    setSearchQuery(query) {
      this.searchQuery = query
    },

    async fetchUsers() {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users`)
        if (data.value) {
          this.users = data.value.result
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        this.error = error
      } finally {
        this.isLoading = false
      }
    },

    async fetchAndSetUser(email) {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users/current/${email}`)
        if (data.value) {
          this.setUser(data.value)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },

    async updateUserProfile(profileData) {
      if (!this.userData || !this.userData._id) {
        console.error('No user data available')
        return
      }

      try {
        console.log('Sending update request with data:', profileData)
        const { data, error } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users/${this.userData._id}`, {
          method: 'PATCH',
          body: profileData
        })

        console.log('Received response:', data.value);

        if (error.value) {
          throw new Error(error.value.message || 'Error updating user profile')
        }

        if (data.value && data.value.success) {
          this.userData = { ...this.userData, ...data.value.result }
          return { success: true, message: 'Profile updated successfully' }
        } else {
          throw new Error(data.value?.message || 'Unknown error occurred')
        }
      } catch (error) {
        console.error('Error updating user profile:', error)
        return { success: false, message: error.message }
      }
    },
  },
  getters: {
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users
      }
      const lowercaseQuery = this.searchQuery.toLowerCase()
      return this.users.filter(user => 
        user.username.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery)
      )
    }
  },
  persist: {
    storage: persistedState.localStorage,
  },
})