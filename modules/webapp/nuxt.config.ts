import { Configuration } from '@nuxt/types';

const config: Configuration = {
  target: 'static',
  head: {
    title: 'GLO Διερμηνευτής της Γλώσσας',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Χρησιμοποίησε τον GLO Διαδικτυακό διερμηνευτή της Γλώσσας για να γράψεις προγράμματα σε γλώσσα από τον φυλλομετρητή σου. Ο διερμηνευτής παρέχει πλήρη υποστήριξη όλων των εντολών της Γλώσσας.',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://kit.fontawesome.com/961656ab70.js',
        crossOrigin: 'anonymous',
      },
    ],
  },
  generate: {
    fallback: true,
  },
  loading: { color: '#fff' },
  css: ['reset-css'],
  plugins: ['./plugins/fullscreen.ts'],
  buildModules: ['@nuxt/typescript-build'],
  modules: ['@nuxtjs/axios', 'nuxt-webfontloader'],
  webfontloader: {
    google: {
      families: ['Roboto Mono'],
    },
  },
  build: {
    transpile: ['vee-validate/dist/rules'],
    extend(config, ctx) {
      if (ctx.isDev) {
        // For debugging
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
    },
  },
};

export default config;
