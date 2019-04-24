<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="showRegister" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"><v-icon>person</v-icon> Registration</span>
          </v-card-title>
          <v-card-text>
            <v-layout column wrap>
              <v-flex>
                <v-text-field
                  v-model="username"
                  outline
                  label="Username"
                  required
                  @input="lowerUsername()"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="firstName"
                  outline
                  label="First Name"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="lastName"
                  outline
                  label="Last Name"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="email"
                  outline
                  label="Email"
                  type="email"
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
              <v-flex>
                <v-text-field
                  v-model="passwordAgain"
                  outline
                  label="Password (Re-type)"
                  required
                  type="password"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="pink" @click="$emit('register-close')">Cancel</v-btn>
            <v-btn class="green" @click="registerUser()">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar
      v-model="passwordNotMatch"
      :timeout="5000"
      color="pink"
      top
      class="subheading"
      multi-line
    >
      The passwords you entered did not match. Please enter the passwords
      correctly.
      <v-btn fab flat @click="passwordNotMatch = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="notComplete"
      :timeout="5000"
      color="orange"
      top
      class="subheading"
      multi-line
    >
      The form is not yet complete. Please fill in the form completely.
      <v-btn fab flat @click="notComplete = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="error"
      :timeout="6000"
      color="pink"
      top
      multi-line
      class="subheading"
    >
      Oh, something went wrong. You might have given invalid inputs or you were
      trying to create an account that already exists.
      <v-btn fab flat @click="error = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="usernameInvalid"
      :timeout="5000"
      color="pink"
      top
      class="subheading"
      multi-line
    >
      You entered an invalid username. Your username must not have spaces.
      <v-btn fab flat @click="usernameInvalid = false">
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
    showRegister: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordAgain: '',
      passwordNotMatch: false,
      notComplete: false,
      usernameInvalid: false,
      error: false,
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
    lowerUsername() {
      this.username = this.username.toLowerCase()
    },
    async registerUser() {
      if (
        (this.username !== '') &
        (this.firstName !== '') &
        (this.lastName !== '') &
        (this.email !== '') &
        (this.password !== '') &
        (this.passwordAgain !== '')
      ) {
        if (!this.username.includes(' ')) {
          if (this.password === this.passwordAgain) {
            await axios
              .post('https://needyourhelp-api.herokuapp.com/auth/register/', {
                username: this.username,
                first_name: this.firstName,
                last_name: this.lastName,
                email: this.email,
                password: this.password
              })
              .then(async res => {
                await axios
                  .post('https://needyourhelp-api.herokuapp.com/token/', {
                    username: this.username,
                    password: this.password
                  })
                  .then(async res => {
                    localStorage.setItem('needyourhelp_access', res.data.access)
                    await getAuth(this.$store)
                    this.loginCorrect = true
                    this.$emit('register-close')
                  })
                  .catch(() => {
                    this.error = true
                  })
              })
              .catch(() => {
                this.error = true
              })
          } else this.passwordNotMatch = true
        } else this.usernameInvalid = true
      } else this.notComplete = true
    }
  }
}
</script>
