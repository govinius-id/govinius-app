import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Govinius',
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'msapplication-TileColor',
          content: '#2a52be',
        },
        {
          name: 'theme-color',
          content: '#2a52be',
        },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/icons/favicon.ico',
        },
        {
          rel: 'icon',
          sizes: '32x32',
          href: '/icons/favicon-32x32.png',
          type: 'image/png',
        },
        {
          rel: 'icon',
          sizes: '16x16',
          href: '/icons/favicon-16x16.png',
          type: 'image/png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/icons/android-chrome-192x192.png',
          sizes: '192x192',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/icons/android-chrome-512x512.png',
          sizes: '512x512',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/icons/apple-touch-icon.png',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css', '~/assets/css/tailwind.css'],

  modules: ['@pinia/nuxt', '@vueuse/nuxt'],

  vite: {
    plugins: [tailwindcss()],
  },

  routeRules: {
    '/auth/**': { ssr: false },
    '/panel/**': { ssr: false },
  },

  runtimeConfig: {
    mysqlHost: '',
    mysqlPort: '',
    mysqlUser: '',
    mysqlPassword: '',
    mysqlDatabase: '',
    mailHost: '',
    mailPort: '',
    mailUser: '',
    mailPassword: '',
    mailFrom: '',
    jwtSecret: '',
    discordWebhookUrl: '',
    loginMasterUser: '',
    loginMasterPassword: '',
    gcpProjectId: '',
    gcpBucketName: '',
    public: {
      app_url: '',
      api_url: '',
      socket_io_url: '',
    },
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  imports: {
    dirs: ['./types/**', 'consts/**'],
  },

  nitro: {
    experimental: {
      websocket: true,
    },
    imports: {
      dirs: [
        './types/**',
        './server/consts/**',
        './server/schemas/**',
        './server/guards/**',
        './server/services/**',
      ],
    },
  },

  compatibilityDate: '2025-02-16',
});
