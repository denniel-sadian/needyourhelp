<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="showLogin" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"><v-icon>person</v-icon> Login</span>
          </v-card-title>
          <v-card-text>
            <v-layout column wrap>
              <v-flex>
                <v-text-field
                  v-model="username"
                  outline
                  label="Username"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="password"
                  outline
                  label="Password"
                  required
                  type="password"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="pink" @click="$emit('login-close')">Cancel</v-btn>
            <v-btn class="green" @click="loginUser()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar
      v-model="loginError"
      :timeout="5000"
      color="pink"
      top
      class="subheading"
      multi-line
    >
      Oh, something went wrong. You might have given wrong credentials or they
      do not belong to any account.
      <v-btn fab flat @click="loginError = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="loginCorrect"
      :timeout="5000"
      color="green"
      top
      multi-line
      class="subheading"
    >
      Welcome to Need Your Help, {{ userFullName }}!
      <v-btn fab flat @click="loginCorrect = false">
        <v-icon>check_circle</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import getAuth from '~/utils/getAuth.js'
import axios from 'axios'

export default {
  props: {
    showLogin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      username: '',
      password: '',
      loginError: false,
      loginCorrect: false
    }
  },
  computed: {
    userFullName() {
      if (this.$store.getters.auth.username) {
        return `${this.$store.getters.auth.first_name} ${
          this.$store.getters.auth.last_name
        }`
      } else return false
    }
  },
  methods: {
    loginUser() {
      axios
        .post('http://127.0.0.1:8000/token/', {
          username: this.username,
          password: this.password
        })
        .then(res => {
          localStorage.setItem('needyourhelp_access', res.data.access)
          this.loginCorrect = true
          getAuth(this.$store)
          this.username = ''
          this.password = ''
          this.$emit('login-close')
        })
        .catch(() => {
          this.loginError = true
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
