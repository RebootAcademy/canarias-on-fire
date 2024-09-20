import navbarEn from './locales/en/navbar.json'
import navbarEs from './locales/es/navbar.json'
import categorySelectorEn from './locales/en/categories.json'
import categorySelectorEs from './locales/es/categories.json'
import indexEn from './locales/en/index.json'
import indexEs from './locales/es/index.json'
import eventEn from './locales/en/events.json'
import eventEs from './locales/es/events.json'
import validationEn from './locales/en/validation.json'
import validationEs from './locales/es/validation.json'
import articlesES from './locales/es/articles.json'
import articlesEN from './locales/en/articles.json'
import bandsEN from './locales/en/bands.json'
import bandsES from './locales/es/bands.json'
import restaurantsES from './locales/es/restaurants.json'
import restaurantsEN from './locales/en/restaurants.json'
import dashboardES from './locales/es/dashboard.json'
import dashboardEN from './locales/en/dashboard.json'
import toastES from './locales/es/toast.json'
import toastEN from './locales/en/toast.json'



export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'es',
  messages: {
    en: {
      ...navbarEn,
      ...categorySelectorEn,
      ...indexEn,
      ...eventEn,
      ...validationEn,
      ...articlesEN,
      ...bandsEN,
      ...restaurantsEN,
      ...dashboardEN,
      ...toastEN
    },
    es: {
      ...navbarEs,
      ...categorySelectorEs,
      ...indexEs,
      ...eventEs,
      ...validationEs,
      ...articlesES,
      ...bandsES,
      ...restaurantsES,
      ...dashboardES,
      ...toastES
    },
  },
}))