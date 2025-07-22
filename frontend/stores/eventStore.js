import { defineStore } from 'pinia'
import { getIslandFromCoordinates } from '../utils/locationUtils'

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
    musicType: [],
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
    reviewed: false,
    selectedGenres: [],
  }),

  actions: {
    addMusicType(type) {
      const index = this.musicType.indexOf(type)
      if (index === -1) {
        this.musicType.push(type)
      } else {
        this.musicType.splice(index, 1)
      }
      console.log(
        `Music type ${type} ${
          index === -1 ? 'added' : 'removed'
        }. Current types:`,
        this.musicType
      )
    },
    updateState(key, value) {
      this[key] = value
    },

    removeEvent(eventId) {
      this.events = this.events.filter((event) => event._id !== eventId)
    },

    toggleGenre(genreValue) {
      // 1. Lógica para el género 'all'
      if (genreValue === 'all') {
        // Si 'all' ya está seleccionado, lo deseleccionamos (limpiamos todo).
        // Usar 'includes' es más seguro que comprobar length y el índice [0].
        if (this.selectedGenres.includes('all')) {
          this.selectedGenres = []
        } else {
          // Si no está seleccionado, lo establecemos como el único filtro.
          this.selectedGenres = ['all']
        }
        return // Salimos de la función para no ejecutar el resto de la lógica.
      }

      // 2. Lógica para el caso especial 'djs' (tu lógica original está bien)
      if (genreValue === 'djs') {
        const hasDjs = this.selectedGenres.includes('djs')
        const hasElectronic = this.selectedGenres.includes('electronic')

        // Primero, nos aseguramos de que 'all' no esté seleccionado.
        this.selectedGenres = this.selectedGenres.filter((g) => g !== 'all')

        if (hasDjs && hasElectronic) {
          this.selectedGenres = this.selectedGenres.filter(
            (g) => g !== 'djs' && g !== 'electronic'
          )
        } else {
          if (!hasDjs) this.selectedGenres.push('djs')
          if (!hasElectronic) this.selectedGenres.push('electronic')
        }
        return
      }

      // 3. Lógica para todos los demás géneros
      // Nos aseguramos de que 'all' se deseleccione si elegimos un género específico.
      this.selectedGenres = this.selectedGenres.filter((g) => g !== 'all')

      const index = this.selectedGenres.indexOf(genreValue)
      if (index === -1) {
        // Si el género no está, lo añadimos.
        this.selectedGenres.push(genreValue)
      } else {
        // Si ya está, lo quitamos.
        this.selectedGenres.splice(index, 1)
      }
    },

    clearGnre() {
      this.selectedGenres = []
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
        (this.eventType = this.eventType || ''),
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
        (this.endTime = ''),
        (this.reviewed = false),
        (this.nameByAdmin = '')
    },

    async fetchEvents(lat, lng) {
      this.isLoading = true
      this.error = null

      try {
        const url = lat && lng ? `/events?lat=${lat}&lng=${lng}` : `/events`

        const { data, error } = await useFetch(url, {
          baseURL: useRuntimeConfig().public.apiBaseUrl,
        })

        if (error.value) {
          console.error('Error fetching events:', error.value)
          this.error = error.value
          this.events = []
          return { error: error.value }
        }

        this.events = Array.isArray(data.value?.result) ? data.value.result : []
        return { data: this.events }
      } catch (error) {
        console.error('Unexpected error fetching events:', error)
        this.error = error
        this.events = []
        return { error }
      } finally {
        this.isLoading = false
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

    async fetchEventBySlug(slug) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useFetch(`/events/slug/${slug}`, {
          baseURL: useRuntimeConfig().public.apiBaseUrl,
        })

        if (error.value) {
          console.error('Error fetching event:', error.value)
          this.error = error.value
          return { error: error.value }
        }

        const eventData = data.value?.result
        if (eventData && eventData.categories && this.categories.length > 0) {
          eventData.categories = eventData.categories
            .map((catId) => {
              return (
                this.categories.find(
                  (c) => c.id === catId || c._id === catId
                ) || catId
              )
            })
            .filter(Boolean)
        }

        this.event = eventData
        return { data: this.event }
      } catch (error) {
        this.error = error.message
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

    async createEvent(token) {
      try {
        const eventData = this.getEventData()

        if (this.eventType === 'promotion') {
          delete eventData.payment
        }

        const { data } = await useFetch(`/events`, {
          baseURL: useRuntimeConfig().public.apiBaseUrl,
          method: 'POST',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
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

    async saveEvent(isNew = true, token = null) {
      const eventData = this.getEventData()
      console.log(eventData)
      const url = isNew ? '/events' : `/events/${this.event._id}`
      const method = isNew ? 'POST' : 'PATCH'

      // Deshacerse de info no deseada al editar
      if (!isNew) {
        delete eventData.userId
        delete eventData.payment
      }

      const { data, error } = await useFetch(url, {
        method,
        body: eventData,
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
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

    createEvent(token) {
      if (token) {
        return this.saveEvent(true, token)
      }
    },

    updateEvent(token = null) {
      if (token) {
        return this.saveEvent(false, token)
      }
    },

    async updateEventByAdmin(eventId, token) {
      const { data, error } = await useFetch(`/events/admin/${eventId}`, {
        method: 'PATCH',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
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

    async updateEventStatus(eventId, status, token) {
      const { data, error } = await useFetch(`/events/${eventId}`, {
        method: 'PATCH',
        body: { status },
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
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

    async updatePromotion(eventId, status, token) {
      const { data, error } = await useFetch(`/events/cancel/${eventId}`, {
        method: 'PATCH',
        body: { status },
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
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

    // new
    async updateEventReviewed(eventId, reviewed, token) {
      try {
        const data = await $fetch(`/events/${eventId}`, {
          method: 'PATCH',
          body: { reviewed },
          baseURL: useRuntimeConfig().public.apiBaseUrl,
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
          },
        })

        if (data.success) {
          this.event = data.result
          this.events = this.events.map((event) =>
            event._id === eventId ? { ...event, reviewed } : event
          )
          return { data: this.event }
        } else {
          const customError = new Error(
            data.error || 'Failed to update event status'
          )
          console.error('Error updating event status:', customError)
          return { error: customError }
        }
      } catch (error) {
        console.error('Error updating event reviewed:', error)
        return { error }
      }
    },

    async deleteEvent(id, token) {
      const { error } = await useFetch(`/events/${id}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
      })

      if (error.value) {
        console.error('Error deleting event:', error.value)
        return { error: error.value }
      }

      this.events = this.events.filter((event) => event._id !== id)
      return { success: true }
    },

    async deleteAllMyClosedEvents(id, type, token) {
      const { data, error } = await useFetch(`/events/user/${id}/${type}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
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
          typeof cat === 'object' ? cat._id || cat.id : cat
        ),
        categoriesOfServices: this.selectedCategoriesByServices,
        status: this.status,
        userId: this.userId,
        payment: this.payment,
        musicType: this.musicType,
        adminPayment: this.adminPayment,
        reviewed: this.reviewed,
        nameByAdmin: this.nameByAdmin || '',
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
    },
  },

  getters: {
    filteredAndSortedEvents(state) {
      let events =
        state.events?.filter((event) => event.status === 'published') || []

      const filters = state.filters
      const userStore = useUserStore()

      function parseDateSafely(dateObj) {
        if (!dateObj || typeof dateObj.year === 'undefined') return null
        return new Date(+dateObj.year, +dateObj.month - 1, +dateObj.day)
      }

      const isMusicEvent = (event) => {
        const categoryIds = event.categories?.map((c) => c._id || c.id)
        return categoryIds?.includes('6702ad06009a63bba556a1f3')
      }

      return events.filter((event) => {
        // --- Isla o proximidad ---
        if (filters.islands?.length) {
          let island = null
          if (event.eventLocation?.postalCode) {
            island = getIslandFromPostalCode(event.eventLocation.postalCode)
          } else if (
            Array.isArray(event.eventLocation?.coordinates) &&
            event.eventLocation.coordinates.length === 2
          ) {
            island = getIslandFromCoordinates(
              event.eventLocation.coordinates[0],
              event.eventLocation.coordinates[1]
            )
          }
          if (
            !island ||
            !filters.islands
              .map((i) => i.toLowerCase())
              .includes(island.toLowerCase())
          ) {
            return false
          }
        } else if (userStore.acceptedGeolocation) {
          const coords = event?.eventLocation?.coordinates
          if (!coords || coords.length !== 2) return false
          const dist = getDistanceFromLatLonInKm(
            userStore.location.latitude,
            userStore.location.longitude,
            coords[0],
            coords[1]
          )
          if (!(dist < state.radioLocation / 1000)) {
            return false
          }
        }

        // --- Fecha exacta ---
        if (filters.date && state.selectedFilterByDate === 'all') {
          const selectedDate = parseDateSafely(filters.date)
          const start = parseDateSafely(event.eventDate)
          const end = parseDateSafely(event.eventEndDate) || start
          if (!(selectedDate >= start && selectedDate <= end)) {
            return false
          }
        }

        // --- Filtros relativos ---
        switch (state.selectedFilterByDate) {
          case 'today': {
            const start = parseDateSafely(event.eventDate)
            const end = parseDateSafely(event.eventEndDate) || start
            if (
              !(
                start &&
                (state.isSameDay(start, new Date()) ||
                  state.isWithinRange(start, end, new Date()))
              )
            ) {
              return false
            }
            break
          }
          case 'weekend': {
            const today = new Date()
            const day = today.getDay()
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)
            const start = parseDateSafely(event.eventDate)
            const end = parseDateSafely(event.eventEndDate) || start
            if (
              !(
                state.isWithinRange(startOfWeek, endOfWeek, start) ||
                state.isWithinRange(start, end, endOfWeek)
              )
            ) {
              return false
            }
            break
          }
          case 'month': {
            const now = new Date()
            const start = parseDateSafely(event.eventDate)
            if (
              !(
                start &&
                start.getFullYear() === now.getFullYear() &&
                start.getMonth() === now.getMonth()
              )
            ) {
              return false
            }
            break
          }
        }

        // --- Categorías ---
        const selectedCategoryIds = [
          ...new Set([
            ...(filters.categories || []),
            ...state.selectedCategories.map((cat) =>
              typeof cat === 'object' ? cat.id || cat._id : cat
            ),
          ]),
        ]
        if (selectedCategoryIds.length > 0) {
          const eventCategoryIds = event.categories?.map((cat) =>
            typeof cat === 'object' ? cat._id || cat.id : cat
          )
          if (
            !selectedCategoryIds.some((catId) =>
              eventCategoryIds.includes(catId)
            )
          ) {
            return false
          }
        }

        // --- Géneros musicales ---
        if (state.selectedGenres.length > 0) {
          if (isMusicEvent(event)) {
            if (
              !state.selectedGenres.includes('all') &&
              !event.musicType?.some((genre) =>
                state.selectedGenres.includes(genre)
              )
            ) {
              return false
            }
          }
          // Si no es música, este filtro no afecta.
        }

        // --- Búsqueda ---
        if (state.searchQuery?.trim()) {
          const query = state.searchQuery.toLowerCase()
          if (
            !(
              event.eventName?.toLowerCase().includes(query) ||
              event.eventDescription?.toLowerCase().includes(query)
            )
          ) {
            return false
          }
        }

        // Pasa todos los filtros
        return true
      })
    },
    filteredEvents() {
      if (!this.events) return []
      const today = new Date()
      const lowercaseQuery = this.searchQuery?.toLowerCase() || ''
      const hasCategoriesFilter =
        this.filters.categories.length > 0 || this.selectedCategories.length > 0
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
          let eventIsland = null

          if (event.eventLocation?.postalCode) {
            eventIsland = getIslandFromPostalCode(
              event.eventLocation.postalCode
            )
          }

          if (
            !eventIsland &&
            Array.isArray(event.eventLocation?.coordinates) &&
            event.eventLocation.coordinates.length === 2
          ) {
            eventIsland = getIslandFromCoordinates(
              event.eventLocation.coordinates[0],
              event.eventLocation.coordinates[1]
            )
          }

          if (
            !eventIsland ||
            !this.filters.islands
              .map((i) => i.toLowerCase())
              .includes(eventIsland.toLowerCase())
          ) {
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
              new Date(filterDate.year, filterDate.month - 1, filterDate.day)
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

        if (state.filters?.date) {
          if (state.filters?.date) {
            const rawDate = state.filters.date

            let selectedDate = null
            if (
              typeof rawDate === 'object' &&
              'year' in rawDate &&
              'month' in rawDate &&
              'day' in rawDate
            ) {
              selectedDate = new Date(
                rawDate.year,
                rawDate.month - 1,
                rawDate.day
              )
            }

            if (!eventDate || !selectedDate) return false

            // Si no hay eventEndDate, asumimos que el evento dura solo 1 día
            const endDate = eventEndDate || eventDate

            if (selectedDate < eventDate || selectedDate > endDate) {
              return false
            }
          }
        }

        switch (state.selectedFilterByDate) {
          case 'all':
            return true
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
