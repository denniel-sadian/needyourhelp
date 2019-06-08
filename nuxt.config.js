import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'twitter-card', name: 'twitter:card', content: 'summary' },
      {
        hid: 'twitter-preview_img',
        name: 'twitter:image',
        content: 'https://needyourhelp.herokuapp.com/images/logo.png'
      },
      {
        hid: 'preview_img',
        property: 'og:image',
        content: 'https://needyourhelp.herokuapp.com/images/logo.png'
      },
      {
        hid: 'website_type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'site_url',
        property: 'og:url',
        content: 'https://needyourhelp.herokuapp.com'
      },
      {
        hid: 'site_title',
        property: 'og:title',
        content: 'Need Your Help'
      },
      {
        hid: 'site_description',
        property: 'og:description',
        content: 'Welcome, to a friendly online-test website!'
      },
      {
        hid: 'fb_app_id',
        property: 'fb:app_id',
        content: '349369982430993'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/logo.png' },
      { rel: 'stylesheet', href: '/css/all.css' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'yellow' },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.styl', '~/assets/css/transitions.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/vuetify'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-session'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
