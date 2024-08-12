import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    isAuthenticated: false,
    users: [],
    selectedUser: null,
    searchQuery: '',
    isLoading: false,
    error: null
  }),

  actions: {
    setUser(data) {
      this.userData = data.result
      this.isAuthenticated = true
    },
    setSelectedUser(user) {
      this.selectedUser = user
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

    async addUser(userData) {
      this.isLoading = true
      this.error = null
      try {
        console.log('Sending user data:', userData)
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/users`, {
          method: 'POST',
          body: userData
        })
        this.users.push(response.user)
        return response.user
      } catch (error) {
        this.error = error.message
        console.error('Error adding user:', error)
        throw error
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
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/users/${profileData._id}`, {
          method: 'PATCH',
          body: profileData
        })

        // Asumimos que la respuesta exitosa contiene directamente los datos del usuario actualizado
        const updatedUser = response
        const index = this.users.findIndex(u => u._id === updatedUser._id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
        // Actualizamos también userData si es el usuario actual
        if (this.userData && this.userData._id === updatedUser._id) {
          this.userData = updatedUser
        }
        return { success: true, message: 'Profile updated successfully', user: updatedUser }
      } catch (error) {
        console.error('Error updating user profile:', error)
        return { success: false, message: error.message || 'Failed to update profile' }
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

    async updateUserSubscription(userId, planId) {
      try {
        const { data } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users/${userId}/subscription`, {
          method: 'PATCH',
          body: JSON.stringify({ subscriptionId: planId }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (data.value && data.value.success) {
          const updatedUser = data.value.result
          // Actualizar el usuario en el array de usuarios
          const userIndex = this.users.findIndex(user => user._id === userId)
          if (userIndex !== -1) {
            this.users[userIndex] = updatedUser
          }

          // Si el usuario actualizado es el usuario actual, actualizar userData
          if (this.userData && this.userData._id === userId) {
            this.userData = updatedUser
          }

          return { success: true, user: updatedUser }
        } else {
          return { success: false, error: data.value?.error || 'Failed to update subscription' }
        }
      } catch (error) {
        console.error('Error updating user subscription:', error)
        return { success: false, error: 'An error occurred while updating the subscription' }
      }
    },

    async updateUserSubscriptionStatus(userId, newStatus) {
      const userIndex = this.users.findIndex(user => user._id === userId)
      if (userIndex !== -1) {
        this.users[userIndex].activeSubscription.status = newStatus
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
    },
    userSubscription: (state) => state.userData?.subscription || null
  },

  persist: {
    storage: persistedState.localStorage,
  },
})