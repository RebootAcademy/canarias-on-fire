import { defineStore } from 'pinia'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    selectedCategories: [],
    eventName: '',
    eventDate: '',
    eventLocalization: '',
    eventPrice: 0,
    eventCapacity: 0,
    eventDescription: '',
    startTime: '',
    endTime: ''
  }),
  actions: {
    toggleCategory(category) {
      const index = this.selectedCategories.findIndex(c => c._id === category._id)
      if (index === -1) {
        this.selectedCategories.push(category)
      } else {
        this.selectedCategories.splice(index, 1)
      }
    },
  }
})