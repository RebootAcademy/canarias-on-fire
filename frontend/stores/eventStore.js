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
    eventDate: {
      year: null,
      month: null,
      day: null
    },
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
    setFilterModalOpen(isOpen) {
      this.isFilterModalOpen = isOpen
    },
    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },
    resetFilters() {
      this.selectedCategory = null
      this.searchQuery = ''
      this.filters = {
        islands: [],
        date: null,
        startTime: null,
        categories: []
      }
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
      return this.events.filter(event => {

        // Search
        if (this.searchQuery) {
          const lowercaseQuery = this.searchQuery.toLowerCase()
          filtered = filtered.filter(event => 
            event.eventName.toLowerCase().includes(lowercaseQuery) ||
            event.eventDescription.toLowerCase().includes(lowercaseQuery)
          )
        }
        // Filter by Categories
        if (this.filters.categories.length > 0) {
          const eventCategoryIds = event.categories.map(cat => cat._id)
          if (!this.filters.categories.some(id => eventCategoryIds.includes(id))) {
            return false
          }
        }
  
        // Filter by islands
        if (this.filters.islands.length > 0) {
          if (!this.filters.islands.includes(event.eventLocation.island)) {
            return false
          }
        }
  
/*         // Filter by Date
        if (this.filters.date) {
          const filterDate = new Date(this.filters.date)
          const eventDate = new Date(event.eventDate)
          
          if (isNaN(filterDate.getTime()) || isNaN(eventDate.getTime())) {
            console.error('Invalid date:', this.filters.date, event.eventDate)
            return false
          }
  
          if (filterDate.getFullYear() !== eventDate.getFullYear() ||
              filterDate.getMonth() !== eventDate.getMonth() ||
              filterDate.getDate() !== eventDate.getDate()) {
            return false
          }
        } */
  
        // Filter by startTime
/*         if (this.filters.startTime) {
          filtered = filtered.filter(event => 
            new Date(`1970-01-01T${event.startTime}`).getTime() >= new Date(`1970-01-01T${this.filters.startTime}`).getTime()
          )
        } */
  
        return true
        })
      }
    },
    eventsCount() {
      return this.events.length
    },
    getCategoryById: (state) => (id) => {
      return state.categories.find(category => category.id === id)
    }
})