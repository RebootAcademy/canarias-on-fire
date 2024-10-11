// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/v_logo.ico' },
        { rel: 'canonical', href: 'https://evente.netlify.app' },
      ],
      title: 'Evente',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            'Descubre eventos emocionantes en tu área, desde conciertos hasta conferencias. ¡Únete a nuestra comunidad y no te pierdas ninguna promoción!',
        },
        {
          property: 'og:title',
          content: 'Evente - Tu página para encontrar y publicar eventos',
        },
        {
          property: 'og:description',
          content:
            'Descubre eventos emocionantes en tu área, desde conciertos hasta conferencias. ¡Únete a nuestra comunidad y no te pierdas ninguna promoción!',
        },
        {
          property: 'og:image',
          content:
            'https://res.cloudinary.com/drs1a2bso/image/upload/fl_preserve_transparency/v1725710854/logo_color_c8o0q3.jpg?_s=public-apps',
        },
        { property: 'og:url', content: 'https://evente.netlify.app' },
      ],
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-csurf',
    '@nuxt/image',
    '@nuxt/devtools',
    '@nuxtjs/i18n',
    '@element-plus/nuxt',
  ],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'es',
    vueI18n: './i18n.config.ts',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'es',
    },
  },
  vite: {
    define: {
      __VUE_PROD_DEVTOOLS__: true,
    },
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
    componentDir: './components/ui',
  },
  runtimeConfig: {
    public: {
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
      auth0TokenApi: process.env.AUTH0_TOKEN_API,
      apiBaseUrl: process.env.API_BASE_URL,
      auth0Audience: process.env.AUTH0_AUDIENCE,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    },
  },
  build: {
    transpile: ['@fawmi/vue-google-maps'],
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
    '/event/:id': { ssr: true },
  },
  plugins: ['~/plugins/auth0.js'],
})
