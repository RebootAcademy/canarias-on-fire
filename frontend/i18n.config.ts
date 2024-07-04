import navbarEn from './locales/en/navbar.json'
import navbarEs from './locales/es/navbar.json'
import categorySelectorEn from './locales/en/categories.json'
import categorySelectorEs from './locales/es/categories.json'
import indexEn from './locales/en/index.json'
import indexEs from './locales/es/index.json'
import eventEn from './locales/en/events.json'
import eventEs from './locales/es/events.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'es',
  messages: {
    en: {
      ...navbarEn,
      ...categorySelectorEn,
      ...indexEn,
      ...eventEn
    },
    es: {
      ...navbarEs,
      ...categorySelectorEs,
      ...indexEs,
      ...eventEs
    }
  }
}))