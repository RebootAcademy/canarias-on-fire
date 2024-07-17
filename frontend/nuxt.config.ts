// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-csurf',
    '@nuxt/image',
    '@nuxt/devtools',
    "@nuxtjs/i18n"
  ],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'es',
    vueI18n: './i18n.config.ts'
  },
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: true
    }
  },
  devtools: { 
    enabled: true, 
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      apiBaseUrl: process.env.API_BASE_URL,
      auth0Audience: process.env.AUTH0_AUDIENCE,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  },
  build: {
    transpile: ["@fawmi/vue-google-maps"]
  },
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
    // Product page generated on-demand, revalidates in background
    '/products/**': { swr: true },
    // Blog post generated on-demand once until next deploy
    '/blog/**': { isr: true },
    // Admin dashboard renders only on client-side
    '/admin/**': { ssr: false },
    // Add cors headers on API routes
    '/api/**': { cors: true },
    // Redirects legacy urls
    '/old-page': { redirect: '/new-page' },
    '/event/:id': { ssr: true }
  },
  plugins: [
    '~/plugins/auth0.js'
  ]
})