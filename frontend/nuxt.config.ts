// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    'nuxt-csurf',
  ],
  devtools: { enabled: true },
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
    }
  },
   csurf: {
    https: false,
    cookieKey: 'csrf',
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    },
    methodsToProtect: ['POST', 'PATCH'],
    encryptSecret: process.env.CSRF_SECRET,
    addCsrfTokenToEventCtx: true
  }
})