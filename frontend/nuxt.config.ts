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
      script: [
        {
          children: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2716869701843648');
          fbq('track', 'PageView');
          `,
        },
      ],
      noscript: [
        {
          children:
            '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2716869701843648&ev=PageView&noscript=1" />',
        },
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
    '/event/:slug': { ssr: true },
    '/api/clients/unsubscribe/**': {
      csurf: false,
    },
  },
  plugins: ['~/plugins/auth0.js'],
})
