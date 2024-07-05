import { categories } from '@vueuse/core/metadata.cjs'
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

const errors = reactive({
  eventName: '',
  eventDate: '',
  startTime: '',
  description: '',
  location: '',
  price: '',
  categories: ''
})

const priceRules = () => {
  return eventStore.isFree ? '' : 'required'
}

const validateEventDate = () => {
  if (!eventStore.eventDate || !eventStore.eventDate.year || !eventStore.eventDate.month || !eventStore.eventDate.day) {
    return 'Event date is required'
  }
  return ''
}

const validateEventLocation = () => {
  if (!eventStore.eventLocation || !eventStore.eventLocation.address) {
    return 'Event location is required'
  }
  return ''
}

const validateCategories = () => {
  const selectedCount = eventStore.selectedCategories.length
  if (selectedCount < 1) {
    return 'You must select at least one category'
  } else if (selectedCount > 5) {
    return 'You cannot select more than 5 categories'
  }
  return ''
}

const validateFields = () => {
  errors.eventName = eventStore.eventName ? '' : 'Event name is required'
  errors.eventDate = validateEventDate()
  errors.startTime = eventStore.startTime ? '' : 'Start time is required'
  errors.description = eventStore.eventDescription ? '' : 'Description is required'
  errors.location = validateEventLocation()
  errors.price = priceRules() === 'required' && !eventStore.eventPrice ? 'Price is required' : ''
  errors.categories = validateCategories()
}

export { errors, validateFields }