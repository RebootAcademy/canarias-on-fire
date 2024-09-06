import { defineStore } from 'pinia'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    events: [],
    event: {
      eventImages: [],
      coverImage: null,
    },
    categories: [],
    selectedCategories: [],
    selectedFilterByDate: 'all',
    searchQuery: '',
    eventName: '',
    eventType: '',
    eventDate: null,
    eventLocation: {
      address: '',
      coordinates: { lat: null, lng: null },
      postalCode: '',
      mapImageUrl: '',
    },
    eventPrice: 0,
    isFree: false,
    eventCapacity: 0,
    eventDescription: '',
    startTime: '',
    endTime: '',
    externalUrl: '',
    eventImages: [],
    coverImage: null,
    selectedFile: null,
    mapCenter: { lat: 51.09, lng: 6.84 },
    hasTriedSubmit: false,
    googleMapsApiKey: null,
    isLoading: false,
    error: null,
    isFilterModalOpen: false,
    filters: {
      islands: [],
      date: null,
      startTime: null,
      endTime: null,
      categories: [],
    },
    userEvents: [],
    userId: null,
    payment: {},
  }),

  actions: {
    updateState(key, value) {
      this[key] = value
    },

    removeEvent(eventId) {
      this.events = this.events.filter((event) => event._id !== eventId)
    },

    toggleCategory(category) {
      const index = this.selectedCategories.findIndex(
        (c) => c.id === category.id
      )
      if (index === -1) {
        this.selectedCategories.push(category)
      } else {
        this.selectedCategories.splice(index, 1)
      }
    },

    addEventImage(image) {
      this.eventImages.push(image)
    },
    removeEventImage(imageUrl) {
      this.eventImages = this.eventImages.filter(
        (image) => image.url !== imageUrl
      )
    },
    setCoverImage(imageUrl) {
      this.coverImage = imageUrl
    },

    setPlaceDetails(place) {
      const { formatted_address, geometry, address_components, website } = place
      this.eventLocation = {
        address: formatted_address,
        coordinates: {
          lat: geometry.location.lat(),
          lng: geometry.location.lng(),
        },
        postalCode: this.extractPostalCode(address_components),
        mapImageUrl: this.generateMapImageUrl(
          geometry.location.lat(),
          geometry.location.lng()
        ),
      }
      this.externalUrl = website
    },

    extractPostalCode(addressComponents) {
      const postalCodeComponent = addressComponents.find((component) =>
        component.types.includes('postal_code')
      )
      return postalCodeComponent ? postalCodeComponent.long_name : ''
    },

    setMapCenter(lat, lng) {
      this.mapCenter = { lat, lng }
    },
    setMapImageUrl(lat, lng) {
      this.eventLocation.mapImageUrl = this.generateMapImageUrl(lat, lng)
    },
    setHasTriedSubmit(value) {
      this.hasTriedSubmit = value
    },
    setGoogleMapsApiKey(key) {
      this.googleMapsApiKey = key
    },
    generateMapImageUrl(lat, lng) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${this.googleMapsApiKey}`
    },
    setSelectedCategories(categories) {
      this.selectedCategories = categories
    },
    setFilterModalOpen(isOpen) {
      this.isFilterModalOpen = isOpen
    },

    setFilters(newFilters) {
      this.filters = {
        ...this.filters,
        ...newFilters,
        date: newFilters.date
          ? {
              day: newFilters.date.getDate(),
              month: newFilters.date.getMonth() + 1,
              year: newFilters.date.getFullYear(),
            }
          : null,
      }
    },

    setUserId(userId) {
      this.userId = userId
    },

    setPayment(payment) {
      this.payment = payment
    },

    setSelectedFilterByDate(date) {
      this.selectedFilterByDate = date
    },

    resetFilters() {
      this.selectedCategory = null
      this.searchQuery = ''
      this.filters = {
        islands: [],
        date: null,
        startTime: null,
        categories: [],
      }
      this.eventDate = null
    },

    async fetchEvents() {
      const { data, error } = await useFetch('/events', {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
      })

      if (error.value) {
        console.error('Error fetching events:', error.value)
        return { error: error.value }
      }

      this.events = data.value?.result || []
      return { data: this.events }
    },

    async fetchEventById(id) {
      const { data, error } = await useFetch(`/events/${id}`, {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
      })

      if (error.value) {
        console.error('Error fetching event:', error.value)
        return { error: error.value }
      }

      this.event = data.value?.result
      return { data: this.event }
    },

    async fetchUserEvents(userId) {
      const { data, error } = await useFetch(`/events/user/${userId}`, {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
      })

      if (error.value) {
        console.error('Error fetching user events:', error.value)
        return { error: error.value }
      }

      this.userEvents = data.value?.result || []
      return { data: this.userEvents }
    },

    async fetchCategories() {
      if (this.categories.length > 0) return

      this.isLoadingCategories = true
      this.categoriesError = null

      try {
        const config = useRuntimeConfig()
        const apiUrl = `${config.public.apiBaseUrl}/categories`
        const response = await fetch(apiUrl)

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()

        if (data.success && Array.isArray(data.result)) {
          this.categories = data.result.map((category) => ({
            id: category._id,
            name: category.name,
            icon: category.icon,
          }))
        } else {
          throw new Error(
            'Unexpected data structure or request was not successful'
          )
        }
      } catch (error) {
        this.categoriesError = error
      } finally {
        this.isLoadingCategories = false
      }
    },

    async createEvent() {
      try {
        const eventData = this.getEventData()

        if (this.eventType === 'promotion') {
          delete eventData.payment
        }

        const { data } = await useFetch(`${this.apiBase}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(eventData),
        })

        if (data.value?.success) {
          this.event = data.value.result
          return true
        }
        return false
      } catch (error) {
        console.error('Error creating event:', error)
        return false
      }
    },

    async saveEvent(isNew = true) {
      const eventData = this.getEventData()
      const url = isNew ? '/events' : `/events/${this.event._id}`
      const method = isNew ? 'POST' : 'PATCH'

      const { data, error } = await useFetch(url, {
        method,
        body: eventData,
        baseURL: useRuntimeConfig().public.apiBaseUrl,
      })

      if (error.value) {
        console.error(
          `Error ${isNew ? 'creating' : 'updating'} event:`,
          error.value
        )
        return { error: error.value }
      }

      this.event = data.value?.result
      return { data: this.event }
    },

    createEvent() {
      return this.saveEvent(true)
    },

    updateEvent() {
      return this.saveEvent(true)
    },

    async updateEventStatus(eventId, status) {
      const { data, error } = await useFetch(`/events/${eventId}`, {
        method: 'PATCH',
        body: { status },
        baseURL: useRuntimeConfig().public.apiBaseUrl,
      })

      if (error.value) {
        console.error('Error updating event status:', error.value)
        return { error: error.value }
      }

      if (data.value?.success) {
        this.event = data.value.result
        return { data: this.event }
      } else {
        const customError = new Error(
          data.value?.error || 'Failed to update event status'
        )
        console.error('Error updating event status:', customError)
        return { error: customError }
      }
    },

    async deleteEvent(id) {
      const { error } = await useFetch(`/events/${id}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
      })

      if (error.value) {
        console.error('Error deleting event:', error.value)
        return { error: error.value }
      }

      this.events = this.events.filter((event) => event._id !== id)
      return { success: true }
    },

    getEventData() {
      return {
        eventName: this.eventName,
        eventType: this.eventType,
        eventDate: this.eventDate,
        startTime: this.startTime,
        endTime: this.endTime,
        eventDescription: this.eventDescription,
        eventLocation: this.eventLocation,
        eventPrice: this.isFree ? 0 : this.eventPrice,
        isFree: this.isFree,
        eventCapacity: this.eventCapacity,
        externalUrl: this.externalUrl,
        eventImages: this.eventImages,
        coverImage: this.coverImage,
        categories: this.selectedCategories.map((cat) =>
          typeof cat === 'object' ? cat.id : cat
        ),
        status: this.status,
        userId: this.userId,
        payment: this.payment,
      }
    },

    normalizeCategories() {
      this.selectedCategories = this.selectedCategories
        .map((cat) =>
          typeof cat === 'object' ? cat : this.getCategoryById(cat)
        )
        .filter(Boolean) // Remove any undefined categories
    },

    isSameDay(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      )
    },
  },

  getters: {
    filteredEvents() {
      if (!this.events) return []

      return this.events.filter((event) => {
        // Search
        if (this.searchQuery) {
          const lowercaseQuery = this.searchQuery.toLowerCase()
          if (
            !event.eventName.toLowerCase().includes(lowercaseQuery) &&
            !event.eventDescription.toLowerCase().includes(lowercaseQuery)
          ) {
            return false
          }
        }
        // Filter by Categories
        if (this.filters.categories.length > 0) {
          const eventCategoryIds = event.categories.map((cat) => cat._id)
          if (
            !this.filters.categories.some((id) => eventCategoryIds.includes(id))
          ) {
            return false
          }
        }

        // Filtrar por categorías seleccionadas
        if (this.selectedCategories.length > 0) {
          const eventCategoryIds = event.categories.map((c) => c._id)
          const hasMatchingCategory = this.selectedCategories.some((sc) =>
            eventCategoryIds.includes(sc.id)
          )

          if (!hasMatchingCategory) {
            return false
          }
        }

        // Filter by islands
        if (this.filters.islands.length > 0) {
          const eventIsland = getIslandFromPostalCode(
            event.eventLocation.postalCode
          )
          if (!this.filters.islands.includes(eventIsland)) {
            return false
          }
        }

        // Filter by date
        if (this.filters.date) {
          const filterDate = this.filters.date
          const eventDate = event.eventDate
          if (
            !eventDate ||
            eventDate.year !== filterDate.year ||
            eventDate.month !== filterDate.month ||
            eventDate.day !== filterDate.day
          ) {
            return false
          }
        }

        return true
      })
    },
    eventsCount() {
      return this.events.length
    },
  
    getCategoryById: (state) => (id) => {
      return state.categories.find(
        (category) => category.id === id || category._id === id
      )
    },
  
    filteredEventsByDate: (state) => (array) => {
      return array.filter((event) => {
        const eventDate = new Date(
          event.eventDate.year,
          event.eventDate.month - 1,
          event.eventDate.day
        )  
        switch (state.selectedFilterByDate) {
          case 'all':
            return true // Devuelve todos los eventos
          case 'today':
            return state.isSameDay(eventDate, new Date()) // Comparar con la fecha de hoy
          case 'weekend':
            return eventDate.getDay() === 6 || eventDate.getDay() === 0 // Filtro por fin de semana
          case 'month':
            return eventDate.getMonth() === new Date().getMonth() // Filtro por mes actual
          default:
            return true
        }
      })
    },
  },
})