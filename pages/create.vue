<template>
  <v-container id="main" pt-5>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <div class="display-2 text-xs-center font-weight-black">
          Create Topic
        </div>
      </v-flex>
      <v-flex d-flex xs12 pt-5>
        <v-text-field
          v-model="topicTitle"
          label="Topic title"
          outline
          @keyup.enter="save()"
        ></v-text-field>
      </v-flex>
      <v-flex d-flex xs12>
        <v-dialog
          ref="dialog"
          v-model="datePicker"
          :return-value.sync="datePicker"
          persistent
          :style="{ display: datePicker ? 'block' : 'none' }"
          lazy
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateStarted"
              label="Date Started"
              outline
              readonly
              @keyup.enter="save()"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateStarted" scrollable>
            <v-spacer></v-spacer>
            <v-btn round small class="pink" @click="datePicker = false"
              >Cancel</v-btn
            >
            <v-btn
              round
              small
              class="green"
              @click="$refs.dialog.save(dateStarted)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex d-flex xs12>
        <v-textarea
          v-model="topicDesc"
          d-flex
          outline
          label="Topic Description"
        ></v-textarea>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex xs12>
            <v-btn
              block
              class="green"
              round
              :loading="saving"
              :disabled="disabled"
              @click="save()"
              >Next</v-btn
            >
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import getAuth from '~/utils/getAuth.js'
import axios from 'axios'

export default {
  middleware: 'userLoggedIn',
  data() {
    return {
      datePicker: false,
      topicTitle: '',
      topicDesc: '',
      dateStarted: new Date().toISOString().substr(0, 10),
      saving: false,
      disabled: true
    }
  },
  computed: {
    token() {
      return this.$store.getters.token
    }
  },
  watch: {
    topicTitle() {
      this.changeNextSate()
    },
    topicDesc() {
      this.changeNextSate()
    }
  },
  methods: {
    changeNextSate() {
      if (this.topicTitle !== '' && this.topicDesc !== '') {
        this.disabled = false
      } else this.disabled = true
    },
    async save() {
      this.saving = true
      this.disabled = true
      if (
        (this.topicTitle !== '') &
        (this.topicDesc !== '') &
        (this.dateStarted !== '')
      ) {
        const client = axios.create({
          baseURL: 'http://127.0.0.1:8080/',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        await client
          .post('topics/', {
            title: this.topicTitle,
            description: this.topicDesc,
            date_started: this.dateStarted
          })
          .then(res => {
            this.$router.push(`/edit/${res.data.id}`)
          })
          .catch(async () => {
            await getAuth(this.$store)
          })
          .finally(() => (this.saving = false))
      }
    }
  },
  head() {
    return {
      title: 'Need Your Help - Create',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Create your topic to this page.'
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: 'Need Your Help - Create'
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: 'Create your topic to this page.'
        },
        {
          hid: 'site_url',
          property: 'og:url',
          content: 'https://needyourhelp.herokuapp.com/create'
        },
        {
          hid: 'site_title',
          property: 'og:title',
          content: 'Need Your Help - Create'
        },
        {
          hid: 'site_description',
          property: 'og:description',
          content: 'Create your topic to this page.'
        }
      ]
    }
  }
}
</script>

<style scoped>
#main {
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
