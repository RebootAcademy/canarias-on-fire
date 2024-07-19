import { defineStore } from 'pinia'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    event: null,
    categories: [],
    selectedCategories: [],
    selectedCategory: null,
    searchQuery: '',
    events: [],
    eventName: '',
    eventType: '',
    eventDate: '',
    eventLocation: {
      address: '',
      coordinates: { lat: null, lng: null },
      postalCode: '',
      mapImageUrl: ''
    },
    eventPrice: 0,
    isFree: false,
    eventCapacity: 0,
    eventDescription: '',
    startTime: '',
    endTime: '',
    externalUrl: '',
    eventImg: '',
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
      categories: []
    },
    isLoadingCategories: false,
    categoriesError: null
  }),
  
  actions: {
    setEvents(events) {
      this.events = events
    },
    setSelectedCategory(category) {
      this.selectedCategory = category
    },
    setSearchQuery(query) {
      this.searchQuery = query
    },
    setEvent(eventData) {
      this.event = eventData
    },
    toggleCategory(category) {
      const index = this.selectedCategories.findIndex(c => c._id === category._id)
      if (index === -1) {
        this.selectedCategories.push(category)
      } else {
        this.selectedCategories.splice(index, 1)
      }
    },
    setPlaceDetails(place) {
      this.eventLocation.address = place.formatted_address
      this.eventLocation.coordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      const postalCodeComponent = place.address_components.find(component => component.types.includes('postal_code'))
      this.eventLocation.postalCode = postalCodeComponent ? postalCodeComponent.long_name : ''
      this.eventLocation.mapImageUrl = this.generateMapImageUrl(
        place.geometry.location.lat(), 
        place.geometry.location.lng()
      )
      this.externalUrl = place.website
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
    setEvents(events) {
      this.events = events
    },
    setGoogleMapsApiKey(key) {
      this.googleMapsApiKey = key
    },
    generateMapImageUrl(lat, lng) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${this.googleMapsApiKey}`
    },
    resetFilters() {
      this.selectedCategory = null
      this.searchQuery = ''
      this.filters = {
        islands: [],
        date: null,
        startTime: null,
        endTime: null,
        categories: []
      }
    },
    setFilterModalOpen(isOpen) {
      this.isFilterModalOpen = isOpen
    },
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    async fetchEvents() {
      this.isLoading = true
      this.error = null
      try {
        const data = await $fetch('http://localhost:8080/api/events')
        this.events = data.result || []
      } catch (err) {
        console.error('Error fetching events:', err)
        this.error = err
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      if (this.categories.length > 0) return

      this.isLoadingCategories = true
      this.categoriesError = null

      try {
        const config = useRuntimeConfig()
        const apiUrl = `${config.public.apiBaseUrl}/categories`
        const response = await fetch(apiUrl)

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()

        if (data.success && Array.isArray(data.result)) {
          this.categories = data.result.map(category => ({
            id: category._id,
            name: category.name,
            icon: category.icon
          }))
        } else {
          throw new Error('Unexpected data structure or request was not successful')
        }
      } catch (error) {
        this.categoriesError = error
      } finally {
        this.isLoadingCategories = false
      }
    },

  },

  getters: {
    filteredEvents() {
      let filtered = this.events

      if (this.selectedCategory) {
        filtered = filtered.filter(event => 
          event.categories.some(category => category.name === this.selectedCategory)
        )
      }

      if (this.searchQuery) {
        const lowercaseQuery = this.searchQuery.toLowerCase()
        filtered = filtered.filter(event => 
          event.eventName.toLowerCase().includes(lowercaseQuery) ||
          event.eventDescription.toLowerCase().includes(lowercaseQuery)
        )
      }

      if (this.filters.islands.length > 0) {
        filtered = filtered.filter(event => 
          this.filters.islands.includes(event.island)
        )
      }

      if (this.filters.date) {
        filtered = filtered.filter(event => 
          new Date(event.eventDate).toDateString() === new Date(this.filters.date).toDateString()
        )
      }

      if (this.filters.startTime) {
        filtered = filtered.filter(event => 
          new Date(`1970-01-01T${event.startTime}`).getTime() >= new Date(`1970-01-01T${this.filters.startTime}`).getTime()
        )
      }

      if (this.filters.endTime) {
        filtered = filtered.filter(event => 
          new Date(`1970-01-01T${event.endTime}`).getTime() <= new Date(`1970-01-01T${this.filters.endTime}`).getTime()
        )
      }

      if (this.filters.categories.length > 0) {
        filtered = filtered.filter(event => 
          event.categories.some(category => this.filters.categories.includes(category.name))
        )
      }

      return filtered
    },
    eventsCount() {
      return this.events.length
    },
    getCategoryById: (state) => (id) => {
      return state.categories.find(category => category.id === id)
    },
  }
})