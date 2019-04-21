<template>
  <v-container grid-list-xs>
    <v-flex xs12 mt-5>
      <h1 class="text-xs-center display-2">
        Welcome,
        <span v-if="fullname">{{ fullname }}</span>
        <span v-else-if="(firstname === '') | (lastname === '')"
          >respondent</span
        >
        <span v-else>{{ firstname + ' ' + lastname }}</span
        >!
      </h1>
      <p class="mt-5 text-sm-center subheading">
        <span class="title font-weight-black yellow--text">{{
          owner.toUpperCase()
        }}</span>
        would like to interview you about the topic "<span
          class="title font-weight-black yellow--text"
          >{{ title.toUpperCase() }}</span
        >".
      </p>
      <p class="subheading">{{ desc }}</p>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs12 mt-5>
      <v-layout column>
        <v-flex mb-3>
          <div class="subheading">
            Information about you.
          </div>
          <div v-show="fullname" class="grey--text caption">
            You're logged in, so your identification will be used. If you're not
            the person logged in, then you can log him out and input your names.
          </div>
        </v-flex>
        <v-flex>
          <v-container py-0>
            <v-text-field
              v-model="firstname"
              label="Your first name"
              :disabled="fullname !== ''"
              outline
            ></v-text-field>
          </v-container>
        </v-flex>
        <v-flex>
          <v-container pt-0>
            <v-text-field
              v-model="lastname"
              label="Your last name"
              :disabled="fullname !== ''"
              outline
            ></v-text-field>
          </v-container>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 mt-5>
      <v-layout column>
        <v-flex mb-3>
          <div class="subheading">
            Kindly give your opinions for these questions.
          </div>
        </v-flex>
        <v-flex>
          <v-layout column>
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
        <v-flex mt-5>
          <div class="subheading">
            Kindly answer these multiple choice questions.
          </div>
        </v-flex>
        <v-flex>
          <v-layout column>
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
        <v-flex>
          <div>
            <v-btn
              v-if="formComplete"
              block
              round
              class="green"
              @click="
                submit = true
                submittingModal = true
              "
              >I am done!</v-btn
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
  </v-container>
</template>

<script>
import axios from 'axios'

import QuestionHandler from '~/components/QuestionHandler.vue'
import MultipleChoiceHandler from '~/components/MultipleChoiceHandler.vue'

export default {
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
      title: '',
      desc: '',
      owner: '',
      done: '',
      firstname: '',
      lastname: '',
      questions: [],
      multiples: [],
      doneAnswering: false,
      notComplete: false,
      submit: false,
      submittingModal: false
    }
  },
  computed: {
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
      if (v >= 100) this.$router.push('/respond/thankyou')
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
  }
}
</script>

<style scoped></style>
