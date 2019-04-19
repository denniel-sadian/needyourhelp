<template>
  <v-container pt-5>
    <v-layout row wrap>
      <v-flex d-flex xs12>
        <div class="title">Create Topic</div>
      </v-flex>
      <v-flex d-flex xs12 pt-5>
        <v-text-field
          v-model="topicTitle"
          label="Topic title"
          outline
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
            <v-btn block class="green" round @click="save()">Next</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="error"
      :timeout="5000"
      color="orange"
      top
      multi-line
      class="subheading"
    >
      Oh, that's unfortunate. Your session has expired. Please login again.
      <v-btn fab flat @click="error = false">
        <v-icon>check_circle</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      datePicker: false,
      topicTitle: '',
      topicDesc: '',
      dateStarted: new Date().toISOString().substr(0, 10),
      error: false
    }
  },
  computed: {
    token() {
      return this.$store.getters.token
    }
  },
  methods: {
    async save() {
      if (
        (this.topicTitle !== '') &
        (this.topicDesc !== '') &
        (this.dateStarted !== '')
      ) {
        const client = axios.create({
          baseURL: 'http://127.0.0.1:8000/',
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
          .catch(() => {
            this.error = true
          })
      }
    }
  }
}
</script>
