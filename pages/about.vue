<template>
  <v-container grid-list-xs pt-5>
    <div
      class="display-4 text-xs-center font-weight-black hidden-xs-only hidden-sm-only"
    >
      Need Your Help
    </div>
    <div class="display-3 text-xs-center font-weight-black hidden-md-and-up">
      Need Your Help
    </div>
    <p class="headline pt-4">
      {{ firstDesc }}
    </p>
    <v-layout row wrap align-center justify-center my-5>
      <v-flex md4 my-3>
        <div class="display-2 text-xs-center font-weight-light font-italic">
          About the Developer
        </div>
      </v-flex>
      <v-flex md8>
        <p class="subheading">
          This website is an art of
          <a href="https://sadian.herokuapp.com/portfolio/about"
            >Denniel Luis Saway Sadian</a
          >. He got inspired to develop this web application by the continues
          survey works in senior high school. This is his way of helping his
          fellow students. A dream of satisfying what he wants, and that is to
          help through what he can do.
        </p>
      </v-flex>
    </v-layout>
    <v-layout row wrap my-5>
      <v-flex xs12>
        <div class="display-2 text-xs-center font-weight-black">
          Technologies used
        </div>
      </v-flex>
      <v-flex v-for="t in techs" :key="t.name" md3 text-xs-center mt-4 pa-2>
        <img :src="'/images/' + t.image" width="auto" height="125" />
        <div class="headline grey--text">{{ t.name }}</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      techs: [
        { name: 'Django', image: 'python_django.png' },
        { name: 'Vue and Nuxt', image: 'vue_nuxt.png' },
        { name: 'Vuetify', image: 'vuetify.png' },
        { name: 'Django Rest Framework', image: 'drf.png' }
      ],
      firstDesc: `Need Your Help is an online-test platform
      that lets its users survey in a modern way. It introduces
      a paper-less way of surveying, there's no need to print
      applications that you'll distribute to your respondents.
      This website also allows users to dynamically create
      questionnaires for their topics. The results are calculated
      already and displayed in a graphical manner.`
    }
  },
  head() {
    return {
      title: 'Need Your Help - About',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.firstDesc
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: 'Need Your Help - About'
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: this.firstDesc
        },
        {
          hid: 'site_url',
          property: 'og:url',
          content: 'https://needyourhelp.herokuapp.com/about'
        },
        {
          hid: 'site_title',
          property: 'og:title',
          content: 'Need Your Help - About'
        },
        {
          hid: 'site_description',
          property: 'og:description',
          content: this.firstDesc
        }
      ]
    }
  }
}
</script>
