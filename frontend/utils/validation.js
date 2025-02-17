import { useEventStore } from '../stores/eventStore'
const eventStore = useEventStore()

const errors = reactive({
  eventName: '',
  eventDate: '',
  startTime: '',
  description: '',
  location: '',
  categories: ''
})
const priceRules = () => {
  return !eventStore.isFree && eventStore.eventType === 'event' ? 'required' : ''
}

const validateEventDate = (t) => {
  if (eventStore.eventType === 'event') {
    if (!eventStore.eventDate || typeof(eventStore.eventDate) !== 'object' ) {
      return t('eventDateRequired')
    }
  } 
  // else if (eventStore.eventType === 'promotion') {
  //   if (!eventStore.eventDate || !eventStore.eventDate.start || !eventStore.eventDate.end) {
  //     return t('eventDateRequired')
  //   }
  // }
  return ''
} 

const validateStartTime = (t) => {
  if (eventStore.eventType === 'event' && !eventStore.startTime) {
    return t('startTimeRequired')
  } else {
    return ''
  }
}

const validateEventLocation = (t) => {
  if (!eventStore.eventLocation || !eventStore.eventLocation.address) {
    return t('locationRequired')
  }
  return ''
}

const validateCategories = (t) => {
  const selectedCount = eventStore.selectedCategories.length
  console.log(eventStore.selectedCategories)
  if (selectedCount < 1) {
    return t('categoriesRequired')
  } else if (selectedCount > 5) {
    return t('categoriesMax')
  }
  return ''
}

const validateFields = (t) => {
  errors.eventName = eventStore.eventName ? '' : t('eventNameRequired')
  errors.eventDate = validateEventDate(t) 
  errors.startTime = validateStartTime(t)
  errors.description = eventStore.eventDescription ? '' : t('descriptionRequired')
  errors.location = validateEventLocation(t)
  errors.price = priceRules() === 'required' && !eventStore.eventPrice ? t('priceRequired') : ''
  errors.categories = validateCategories(t)
}

export { errors, validateFields }