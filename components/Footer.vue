<template>
  <v-footer id="footer" height="auto" mt-5>
    <v-layout row wrap text-xs-center>
      <v-flex xs12 pt-4>
        <v-container>
          <div class="title">{{ day }} quote</div>
          <h1 v-if="quote" class="display-1 my-3">
            <i>"{{ quote }}"</i>
          </h1>
          <h1 v-else class="display-1 my-3">Loading...</h1>
          <div>
            - <span class="subheading">{{ whose }}</span>
          </div>
        </v-container>
      </v-flex>
      <v-flex xs12>
        <v-container grid-list-xs class="green darken-4" fluid pa-0>
          <v-container grid-list-xs pa-2>
            <v-layout row wrap align-center pa-2>
              <v-flex xs6 md2 order-xs2 order-md1>
                <div class="text-xs-left text-md-left subheading">
                  &copy; {{ year }} Need Your Help
                </div>
              </v-flex>
              <v-flex xs6 md2 order-xs2 order-md1>
                <div class="text-xs-right text-md-left subheading">
                  <nuxt-link to="/privacy-policy" class="subheading white--text"
                    >Privacy Policy</nuxt-link
                  >
                </div>
              </v-flex>
              <v-flex
                class="text-md-right text-md-right"
                order-xs1
                order-md2
                xs12
                md8
              >
                <v-btn flat icon :href="shareTo('facebook')"
                  ><v-icon>fab fa-facebook-square</v-icon></v-btn
                >
                <v-btn flat icon :href="shareTo('twitter')"
                  ><v-icon>fab fa-twitter</v-icon></v-btn
                >
                <v-btn flat icon :href="shareTo('linkedin')"
                  ><v-icon>fab fa-linkedin</v-icon></v-btn
                >
                <v-btn flat icon :href="shareTo('telegram')"
                  ><v-icon>fab fa-telegram-plane</v-icon></v-btn
                >
                <v-btn flat icon :href="shareTo('whatsapp')"
                  ><v-icon>fab fa-whatsapp-square</v-icon></v-btn
                >
                <v-btn flat icon :href="shareTo('pinterest')"
                  ><v-icon>fab fa-pinterest</v-icon></v-btn
                >
                <v-btn flat icon :href="shareTo('reddit')"
                  ><v-icon>fab fa-reddit-alien</v-icon></v-btn
                >
                <v-btn flat icon :href="shareTo('mail')"
                  ><v-icon>fas fa-envelope</v-icon></v-btn
                >
              </v-flex>
            </v-layout>
          </v-container>
        </v-container>
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
    },
    shareLink() {
      return `https://needyourhelp.herokuapp.com${this.$route.path}`
    }
  },
  mounted() {
    axios
      .get('https://denniel.herokuapp.com/extras/api/days/' + this.day)
      .then(res => {
        this.q = res.data
      })
  },
  methods: {
    shareTo(sm) {
      if (sm === 'facebook')
        return `https://web.facebook.com/sharer/sharer.php?u=${this.shareLink}`
      else if (sm === 'twitter')
        return `https://www.twitter.com/share?url=${this.shareLink}`
      else if (sm === 'linkedin')
        return `https://www.linkedin.com/shareArticle/?mini=true&url=${
          this.shareLink
        }`
      else if (sm === 'telegram')
        return `https://telegram.me/share/?url=${this.shareLink}`
      else if (sm === 'whatsapp')
        return `https://api.whatsapp.com/send?text=${this.shareLink}`
      else if (sm === 'pinterest')
        return `https://www.pinterest.ph/pin/find/?url=${this.shareLink}`
      else if (sm === 'reddit')
        return `https://reddit.com/submit?url=${this.shareLink}`
      else if (sm === 'mail')
        return `mailto:?subject=Survey&body=${this.shareLink}`
    }
  }
}
</script>

<style scoped>
#footer {
  background: #4caf50;
  border-top: 5px solid #4caf50;
}

#footer * {
  color: white;
}

.green {
  background: #4caf50 !important;
}
</style>
