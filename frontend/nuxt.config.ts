// frontend/nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],

  devServer: {
    port: 3001
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:4000/api' 
    }
  },

  compatibilityDate: '2025-01-01'
})