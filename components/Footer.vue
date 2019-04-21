<template>
  <v-footer id="footer" height="auto" mt-5>
    <v-layout row wrap text-xs-center>
      <v-flex xs12 pt-4>
        <v-container>
          <div class="title">{{ day }} quote</div>
          <h1 class="display-2 my-3">"{{ quote }}"</h1>
          <div>
            - <span class="subheading">{{ whose }}</span>
          </div>
        </v-container>
      </v-flex>
      <v-flex xs12>
        <div class="purple">&copy; {{ year }}</div>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return { q: {} }
  },
  computed: {
    day() {
      const day = new Date().getDay()
      const names = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      return names[day]
    },
    quote() {
      return this.q.quote
    },
    whose() {
      return this.q.whose
    },
    year() {
      return new Date().getFullYear()
    }
  },
  mounted() {
    axios
      .get('https://denniel.herokuapp.com/extras/api/days/' + this.day)
      .then(res => {
        this.q = res.data
      })
  }
}
</script>

<style scoped>
#footer {
  background: url('../assets/images/header.jpg') !important;
  background-attachment: fixed !important;
  background-size: cover !important;
  background-position: center !important;
}
</style>
