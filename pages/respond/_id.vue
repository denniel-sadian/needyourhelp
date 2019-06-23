<template>
  <v-container grid-list-xs>
    <v-flex xs12 mt-5>
      <h1 class="font-weight-black display-2 text-xs-center">
        {{ title.toUpperCase() }}
      </h1>
      <p class="mt-5 text-sm-center subheading">
        Welcome,
        <span v-if="fullname">{{ fullname }}</span>
        <span v-else-if="(firstname === '') | (lastname === '')"
          >respondent</span
        >
        <span v-else>{{ firstname + ' ' + lastname }}</span>
        !
        {{ headDesc }}
      </p>
      <p class="subheading text-sm-center">{{ desc }}</p>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs12 mt-5>
      <v-layout column>
        <v-flex v-if="!questions.length && !multiples.length">
          <v-alert :value="true" outline type="warning" class="subheading">
            You're too early. The creator of this topic isn't yet providing any
            question to answer. Come back in a few minutes.
          </v-alert>
        </v-flex>
        <v-flex v-if="questions.length || multiples.length" mb-3>
          <div class="subheading">Information about you.</div>
          <div v-show="fullname" class="grey--text caption">
            You're logged in, so your identification will be used. If you're not
            the person logged in, then you can log him out and input your names.
          </div>
        </v-flex>
        <v-flex v-if="questions.length || multiples.length">
          <v-container py-0>
            <v-text-field
              v-model="firstname"
              label="Your first name"
              :disabled="fullname !== ''"
              outline
              @input="checkIfRespondedAlready()"
            ></v-text-field>
          </v-container>
        </v-flex>
        <v-flex v-if="questions.length || multiples.length">
          <v-container pt-0>
            <v-text-field
              v-model="lastname"
              label="Your last name"
              :disabled="fullname !== ''"
              outline
              @input="checkIfRespondedAlready()"
            ></v-text-field>
          </v-container>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 mt-5>
      <v-layout column>
        <v-flex v-if="questions.length > 0" mb-3>
          <div class="subheading">
            Kindly give your opinions for these questions.
          </div>
        </v-flex>
        <v-flex v-if="questions.length > 0">
          <v-layout column wrap>
            <v-flex v-for="q in questions" :key="q.text">
              <QuestionHandler
                :question="q"
                :firstname="firstname"
                :lastname="lastname"
                :submit="submit"
              />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="multiples.length > 0" mt-5>
          <div class="subheading">
            Kindly answer these multiple choice questions.
          </div>
        </v-flex>
        <v-flex v-if="multiples.length > 0">
          <v-layout column wrap>
            <v-flex v-for="q in multiples" :key="q.text">
              <MultipleChoiceHandler
                :question="q"
                :firstname="firstname"
                :lastname="lastname"
                :submit="submit"
              />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="questions.length || multiples.length">
          <div>
            <v-btn
              v-if="formComplete & !respondedAlready"
              block
              round
              class="green"
              :loading="loading"
              @click="prepareSubmit()"
              >I am done!</v-btn
            >
            <v-btn v-else-if="respondedAlready" block round outline class="pink"
              >You've responded to this survey already.</v-btn
            >
            <v-btn v-else block round outline class="green"
              >You're not yet done</v-btn
            >
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <div class="text-xs-center">
      <v-dialog v-model="submittingModal" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Submitting your answers.
            <v-progress-linear
              v-model="submittingProgress"
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <v-layout row justify-center>
      <v-dialog v-model="confirmSubmit" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Confirmation</v-card-title>
          <v-card-text
            >Are you sure and ready to submit your answers?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="pink" flat @click="confirmSubmit = !confirmSubmit"
              >Nope</v-btn
            >
            <v-btn
              color="green"
              flat
              @click="
                trulySubmit()
                confirmSubmit = false
                submittingModal = true
              "
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

import QuestionHandler from '~/components/QuestionHandler.vue'
import MultipleChoiceHandler from '~/components/MultipleChoiceHandler.vue'

export default {
  middleware: 'canStillRespond',
  components: {
    QuestionHandler,
    MultipleChoiceHandler
  },
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      id: null,
      desc: '',
      done: '',
      title: '',
      lastname: '',
      firstname: '',
      questions: [],
      multiples: [],
      submit: false,
      loading: false,
      notComplete: false,
      doneAnswering: false,
      confirmSubmit: false,
      submittingModal: false,
      respondedAlready: false
    }
  },
  computed: {
    headDesc() {
      return `Hello! ${this.owner.toUpperCase()} needs your help!
      Your response to this topic would be very much appreciated.
      It has ${
        this.questions.length > 0 ? this.questions.length : 'no'
      } opinion-answered
      question${this.questions.length > 1 ? 's' : ''} and ${
        this.multiples.length > 0 ? this.multiples.length : 'no'
      }
      multiple-choice${this.multiples.length > 1 ? 's' : ''} only.`
    },
    token() {
      return this.$store.getters.token
    },
    client() {
      const config = { baseURL: 'http://127.0.0.1:8000/' }
      if (this.token !== '')
        config.headers = {
          Authorization: `Bearer ${this.token}`
        }
      const client = axios.create(config)
      return client
    },
    fullname() {
      if (this.$store.getters.auth.username) {
        return `${this.$store.getters.auth.first_name} ${
          this.$store.getters.auth.last_name
        }`
      } else return ''
    },
    submittingProgress() {
      return (this.$store.getters.submitted * 100) / this.totalQuestions
    },
    verifiedQuestions() {
      return this.$store.getters.verifiedQuestions
    },
    totalQuestions() {
      return this.questions.length + this.multiples.length
    },
    preparedQuestions() {
      return this.$store.getters.preparedQuestions
    },
    toSubmit() {
      return this.$store.getters.toSubmit
    },
    formComplete() {
      if (
        (this.totalQuestions === this.verifiedQuestions) &
        (this.firstname !== '') &
        (this.lastname !== '')
      )
        return true
      else return false
    }
  },
  watch: {
    fullname(v) {
      if (v) {
        this.firstname = this.$store.getters.auth.first_name
        this.lastname = this.$store.getters.auth.last_name
      }
    },
    submittingProgress(v) {
      if (v >= 100)
        setTimeout(() => this.$router.push('/respond/thankyou'), 1000)
    }
  },
  async asyncData({ params, store }) {
    const data = {}
    const root = `http://127.0.0.1:8000/topics/${params.id}/`
    await axios.get(root).then(res => {
      data.title = res.data.title
      data.desc = res.data.description
      data.owner = `${res.data.owner_firstname} ${res.data.owner_lastname}`
      data.done = res.data.done
      data.id = params.id
    })
    await axios.get(`${root}questions/`).then(res => {
      data.questions = res.data
    })
    await axios.get(`${root}multiplechoices/`).then(res => {
      data.multiples = res.data
    })
    for (const i in data.multiples) {
      await axios
        .get(`${root}multiplechoices/${data.multiples[i].id}/choices/`)
        .then(res => {
          data.multiples[i].choices = res.data
        })
    }
    if (store.getters.auth.username) {
      data.firstname = store.getters.auth.first_name
      data.lastname = store.getters.auth.last_name
    }
    store.commit('CLEAR_VERIFIED_QUESTIONS')
    store.commit('CLEAR_SUBMITTED_RESPONSE')
    return data
  },
  methods: {
    checkIfRespondedAlready() {
      if ((this.firstname !== '') & (this.lastname !== '')) {
        axios
          .post(`http://127.0.0.1:8000/topics/${this.id}/responded/`, {
            firstname: this.firstname,
            lastname: this.lastname
          })
          .then(res => {
            if (res.data.responded) this.respondedAlready = true
            else this.respondedAlready = false
          })
      }
    },
    async prepareSubmit() {
      this.loading = true
      await axios
        .post('http://127.0.0.1:8000/create-interviewee/', {
          first_name: this.firstname,
          last_name: this.lastname
        })
        .catch(() => {})
        .finally(() => {
          this.submit = true
          this.confirmSubmit = true
        })
    },
    async trulySubmit() {
      if (this.preparedQuestions === this.totalQuestions) {
        for (const i in this.toSubmit) {
          await axios
            .post(this.toSubmit[i].url, this.toSubmit[i].data)
            .then(() => {
              this.$store.commit('INCREMENT_SUBMITTED_RESPONSE')
            })
        }
      }
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.headDesc
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: this.title
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: this.headDesc
        },
        {
          hid: 'twitter-preview_img',
          name: 'twitter:image',
          content: 'https://needyourhelp.herokuapp.com/images/hands.png'
        },
        {
          hid: 'preview_img',
          property: 'og:image',
          content: 'https://needyourhelp.herokuapp.com/images/hands.png'
        },
        {
          hid: 'site_url',
          property: 'og:url',
          content: `https://needyourhelp.herokuapp.com/respond/${this.id}`
        },
        {
          hid: 'site_title',
          property: 'og:title',
          content: this.title
        },
        {
          hid: 'site_description',
          property: 'og:description',
          content: this.headDesc
        }
      ]
    }
  }
}
</script>
