import { defineStore } from 'pinia'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    events: [],
    event: {
      eventImages: [],
      coverImage: null,
    },
    promotionsNearMe: [],
    categories: [],
    selectedCategories: [],
    selectedCategoriesByServices: [],
    selectCategoryForFilterCompany: 'all',
    selectedFilterByDate: 'all',
    musicType: null,
    searchQuery: '',
    eventName: '',
    eventType: '',
    eventDate: null,
    eventEndDate: null,
    eventLocation: {
      address: '',
      coordinates: [],
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
    eventDiscount: '',
    eventCodePromo: '',
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
    payment: null,
    adminPayment: null,
    radioLocation: '20000',
    selectedEventFilter: 'all',
    musicFilter: 'all',
    loading: false,
    error: false,
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

    toogleCategoryForPromotions(category) {
      const index = this.selectedCategoriesForPromotion.findIndex(
        (c) => c.id === category.id
      )
      if (index === -1) {
        this.selectedCategoriesForPromotion.push(category)
      } else {
        this.selectedCategoriesForPromotion.splice(index, 1)
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
    setEventDate(dateRange) {
      this.eventDate = dateRange
    },
    setSearchQuery(query) {
      this.searchQuery = query
    },

    setPromotionsNearMe(promotions) {
      this.promotionsNearMe = promotions
    },

    setPlaceDetails(place) {
      const { formatted_address, geometry, address_components, website } = place
      this.eventLocation = {
        address: formatted_address,
        type: 'Point',
        coordinates: [geometry.location.lat(), geometry.location.lng()],
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
      this.selectedCategories = categories || []
    },
    setSelectedCategoriesOfServices(categories) {
      if (categories === 'delete')
        return (this.selectedCategoriesByServices = [])
      this.selectedCategoriesByServices = categories
    },
    setTypeOfCompanyCategory(type) {
      if (this.selectCategoryForFilterCompany !== type.value) {
        this.selectCategoryForFilterCompany = type.value
      } else {
        this.selectCategoryForFilterCompany = null
      }
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

    setRadioLocation(location) {
      this.radioLocation = location
    },

    resetFilters() {
      this.selectedCategories = []
      this.selectedCategoriesByServices = []
      this.searchQuery = ''
      this.filters = {
        islands: [],
        date: null,
        startTime: null,
        categories: [],
      }
      this.eventDate = null
    },

    resetCreateEventForm() {
      this.eventImages = []
      this.coverImage = null
      ;(this.eventDate = null),
        (this.selectedCategories = []),
        (this.selectedCategoriesByServices = []),
        (this.eventName = ''),
        (this.eventType = 'event'),
        (this.eventDescription = ''),
        (this.externalUrl = ''),
        (this.hasTriedSubmit = false),
        (this.eventDiscount = ''),
        (this.eventCodePromo = ''),
        (this.eventPrice = 0),
        (this.eventCapacity = 0),
        (this.isFree = false),
        (this.payment = null),
        (this.status = null),
        (this.startTime = ''),
        (this.endTime = '')
    },

    async fetchEvents(lat, lng) {
      if (!lat || !lng) {
        const { data, error } = await useFetch(`/events`, {
          baseURL: useRuntimeConfig().public.apiBaseUrl,
        })
        if (error.value) {
          console.error('Error fetching events:', error.value)
          return { error: error.value }
        }
        this.events = data.value?.result || []

        return { data: this.events }
      } else {
        const { data, error } = await useFetch(
          `/events?lat=${lat}&lng=${lng}`,
          {
            baseURL: useRuntimeConfig().public.apiBaseUrl,
          }
        )
        if (error.value) {
          console.error('Error fetching events:', error.value)
          return { error: error.value }
        }
        this.events = data.value?.result || []

        return { data: this.events }
      }
    },

    async fetchEventById(id) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useFetch(`/events/${id}`, {
          baseURL: useRuntimeConfig().public.apiBaseUrl,
        })

        if (error.value) {
          console.error('Error fetching event:', error.value)
          return { error: error.value }
        }
        this.event = data.value?.result
        return { data: this.event }
      } catch (error) {
        this.error = err.message
        console.error('Error fetching event:', this.error)
        return { error: this.error }
      } finally {
        this.loading = false
      }
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
            type: category.type,
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

          this.fetchEvents()
          this.selectedCategories = []
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
      return this.saveEvent(false)
    },

    async updateEventByAdmin(eventId) {
      const { data, error } = await useFetch(`/events/admin/${eventId}`, {
        method: 'PATCH',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        body: JSON.stringify({
          adminPayment: this.adminPayment,
        }),
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
        this.events = this.events.map((event) => {
          if (event._id === eventId) {
            return { ...event, status }
          }
          return event
        })
        return { data: this.event }
      } else {
        const customError = new Error(
          data.value?.error || 'Failed to update event status'
        )
        console.error('Error updating event status:', customError)
        return { error: customError }
      }
    },

    async updatePromotion(eventId, status) {
      const { data, error } = await useFetch(`/events/cancel/${eventId}`, {
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
        this.events = this.events.map((event) => {
          if (event._id === eventId) {
            return { ...event, status }
          }
          return event
        })
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

    async deleteAllMyClosedEvents(id, type) {
      const { data, error } = await useFetch(`/events/user/${id}/${type}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
      })
      if (error.value) {
        console.error('Error deleting events:', error.value)
        return { success: false, error: error.value }
      }

      if (data.value?.success) {
        this.fetchEvents()
        return { success: true }
      }
    },

    getEventData() {
      return {
        eventName: this.eventName,
        eventType: this.eventType,
        eventDate: this.eventDate,
        eventEndDate: this.eventEndDate,
        startTime: this.startTime,
        endTime: this.endTime,
        eventDescription: this.eventDescription,
        eventLocation: this.eventLocation,
        eventDiscount: this.eventDiscount,
        eventCodePromo: this.eventCodePromo,
        eventPrice: this.isFree ? 0 : this.eventPrice,
        isFree: this.isFree,
        eventCapacity: this.eventCapacity,
        externalUrl: this.externalUrl,
        eventImages: this.eventImages,
        coverImage: this.coverImage,
        categories: this.selectedCategories.map((cat) =>
          typeof cat === 'object' ? cat.id : cat
        ),
        categoriesOfServices: this.selectedCategoriesByServices,
        status: this.status,
        userId: this.userId,
        payment: this.payment,
        musicType: this.musicType,
        adminPayment: this.adminPayment,
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

    isWithinRange(start, end, date) {
      if (!start || !date) return false
      const startTime = start.getTime()
      const endTime = end ? end.getTime() : NaN
      const dateTime = date.getTime()

      return startTime <= dateTime && dateTime <= endTime
    }
  },

  getters: {
    filteredEvents() {
      if (!this.events) return []
      const today = new Date()
      const lowercaseQuery = this.searchQuery?.toLowerCase() || ''
      const hasCategoriesFilter = this.filters.categories.length > 0
      const hasSelectedCategoriesFilter = this.selectedCategories.length > 0
      const hasIslandsFilter = this.filters.islands.length > 0

      let result = this.events?.filter((event, i) => {
        // Validar usuario activo
        if (event.userId && !event.userId?.isActive) {
          return false
        }

        let endDate, eventDate

        // Procesar fechas dependiendo del tipo de evento
        if (event.eventType === 'event') {
          eventDate = new Date(
            event.eventDate?.year,
            event.eventDate?.month - 1,
            event.eventDate?.day
          )
          let [hours, minutes] = [0, 0]
          if (event.startTime) {
            ;[hours, minutes] = event?.startTime?.split(':').map(Number)
          }

          endDate = event.eventEndDate
            ? new Date(
                event.eventEndDate.year,
                event.eventEndDate.month - 1,
                event.eventEndDate.day,
                hours,
                minutes
              )
            : new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                hours,
                minutes
              )
        } else {
          endDate = new Date(
            event.eventDate?.end?.year,
            event.eventDate?.end?.month - 1,
            event.eventDate?.end?.day
          )
        }

        // Búsqueda por nombre o descripción del evento
        if (
          lowercaseQuery &&
          !event.eventName?.toLowerCase().includes(lowercaseQuery) &&
          !event.eventDescription?.toLowerCase().includes(lowercaseQuery)
        ) {
          return false
        }

        if (hasCategoriesFilter) {
          const eventCategoryIds = event.categories.map((cat) => cat._id)
          if (
            !this.filters.categories.find((id) => eventCategoryIds.includes(id))
          ) {
            return false
          }
        }

        if (hasSelectedCategoriesFilter) {
          const eventCategoryIds = event.categories.map((cat) => cat._id)
          if (
            !this.selectedCategories
              .map((cat) => cat.id)
              .find((id) => eventCategoryIds.includes(id))
          ) {
            return false
          }
        }
        if (hasIslandsFilter) {
          const eventIsland = getIslandFromPostalCode(
            event.eventLocation?.postalCode
          )
          if (!this.filters.islands.includes(eventIsland)) {
            return false
          }
        }

        // Filtrar por fecha
        if (this.filters.date) {
          const filterDate = this.filters.date
          if (
            !event.eventDate ||
            !this.isWithinRange(
              new Date(
                event.eventDate.year,
                event.eventDate.month - 1,
                event.eventDate.day
              ),
              new Date(
                event.eventEndDate?.year,
                event.eventEndDate?.month - 1,
                event.eventEndDate?.day
              ),
              new Date(
                filterDate.year,
                filterDate.month - 1,
                filterDate.day
              )
            )
          ) {
            return false
          }
        }
        return true
      })
      return result
    },

    eventsCount() {
      return this.events.length
    },

    getCategoryById: (state) => (id) => {
      return state.categories.find(
        (category) => category.id === id || category._id === id
      )
    },

    isCurrentWeek: () => (eventDate) => {
      const today = new Date()

      // Get the current day of the week (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
      const currentDay = today.getDay()

      // Calculate the difference between today and the Monday of this week
      const startOfWeek = new Date(today)
      startOfWeek.setDate(
        today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
      ) // Set to Monday

      // Calculate the end of the week (Sunday)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Set to Sunday

      // Ensure eventDate is a valid Date object
      eventDate = new Date(eventDate)

      // Check if eventDate falls within the current week
      return eventDate >= startOfWeek && eventDate <= endOfWeek
    },

    filteredEventsByDate: (state) => (array) => {
      return array.filter((event) => {
        let eventDate = null
        let eventEndDate = undefined

        if (event.eventDate) {
          eventDate = new Date(
            event.eventDate.year,
            parseInt(event.eventDate.month) - 1,
            event.eventDate.day
          )
        }

        if (event.eventEndDate) {
          eventEndDate = new Date(
            event.eventEndDate.year,
            parseInt(event.eventEndDate.month) - 1,
            event.eventEndDate.day
          )
        }

        switch (state.selectedFilterByDate) {
          case 'all':
            return true // Devuelve todos los eventos
          case 'today':
            return (
              eventDate &&
              (state.isSameDay(eventDate, new Date()) ||
                state.isWithinRange(eventDate, eventEndDate, new Date()))
            )
          case 'weekend':
            const startOfWeek = calculatedDates().startOfWeek
            const endOfWeek = calculatedDates().endOfWeek
            return (
              state.isWithinRange(startOfWeek, endOfWeek, eventDate) ||
              state.isWithinRange(eventDate, eventEndDate, endOfWeek)
            )
          case 'month':
            const now = new Date()
            return (
              eventDate &&
              eventDate.getFullYear() === now.getFullYear() &&
              eventDate.getMonth() === now.getMonth()
            )
          default:
            return true
        }
      })
    },
  },
})
