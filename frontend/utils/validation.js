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

const validateEventDate = (t) => {
  if (!eventStore.eventDate || !eventStore.eventDate.year || !eventStore.eventDate.month || !eventStore.eventDate.day) {
    return t('eventDateRequired')
  }
  return ''
}

const validateEventLocation = (t) => {
  if (!eventStore.eventLocation || !eventStore.eventLocation.address) {
    return t('locationRequired')
  }
  return ''
}

const validateCategories = (t) => {
  const selectedCount = eventStore.selectedCategories.length
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
  errors.startTime = eventStore.startTime ? '' : t('startTimeRequired')
  errors.description = eventStore.eventDescription ? '' : t('descriptionRequired')
  errors.location = validateEventLocation(t)
  errors.price = priceRules() === 'required' && !eventStore.eventPrice ? t('priceRequired') : ''
  errors.categories = validateCategories(t)
}

export { errors, validateFields }