// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@unocss/nuxt'],
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/style.css',
  ],
  ssr: false,
  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
      supabaseStorageUrl: '',
      blobReadWriteToken: '',
    },
  },
})
