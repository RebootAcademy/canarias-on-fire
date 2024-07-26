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
      try {
        const data = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/users/${profileData._id}`, {
          method: 'PATCH',
          body: profileData
        })
    
        if (data.value && data.success) {
          const updatedUser = data.result
          const index = this.users.findIndex(u => u._id === updatedUser._id)
          if (index !== -1) {
            this.users[index] = updatedUser
          }
          return { success: true, message: 'Profile updated successfully', user: updatedUser }
        } else {
          throw new Error(data?.message || 'Unknown error occurred')
        }
      } catch (error) {
        console.error('Error updating user profile:', error)
        return { success: false, message: error.message }
      }
    },

    async deleteUser(userId) {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users/${userId}`, {
          method: 'DELETE'
        })
        if (data.value && data.value.success) {
          this.users = this.users.filter(user => user._id !== userId)
          return { success: true, message: 'User deleted successfully' }
        } else {
          throw new Error(data.value?.message || 'Unknown error occurred')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
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