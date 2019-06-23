<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="showEdit" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"> <v-icon>person</v-icon>Edit profile </span>
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
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="pink" flat @click="$emit('edit-close')">Cancel</v-btn>
            <v-btn color="green" flat :loading="updating" @click="updateUser()"
              >Update</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar
      v-model="success"
      :timeout="6000"
      color="green"
      top
      multi-line
      class="subheading"
    >
      Your profile had been successfully modified. You need to logout and login
      again.
      <v-btn fab flat @click="success = false">
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
      Oh, something went wrong. Try again with your unique credentials.
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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const data = {
      usernameInvalid: false,
      error: false,
      updating: false,
      success: false
    }
    data.username = this.$store.getters.auth.username
    data.firstName = this.$store.getters.auth.first_name
    data.lastName = this.$store.getters.auth.last_name
    data.email = this.$store.getters.auth.email
    return data
  },
  computed: {
    token() {
      return this.$store.getters.token
    },
    client() {
      const client = axios.create({
        baseURL: 'http://127.0.0.1:8000/',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      return client
    },
    auth() {
      return this.$store.getters.auth
    }
  },
  watch: {
    auth: function(v) {
      this.username = v.username
      this.email = v.email
      this.lastName = v.last_name
      this.firstName = v.first_name
    }
  },
  methods: {
    lowerUsername() {
      this.username = this.username.toLowerCase()
    },
    logout() {
      this.$store.commit('SET_TOKEN', '')
      this.$store.commit('SET_AUTH', {})
      localStorage.removeItem('needyourhelp_access')
      this.$router.push('/')
    },
    async updateUser() {
      if (!this.username.includes(' ')) {
        this.updating = true
        if (
          (this.username !== '') &
          (this.firstName !== '') &
          (this.lastName !== '') &
          (this.email !== '')
        ) {
          await this.client
            .put('auth/me/', {
              username: this.username,
              email: this.email,
              first_name: this.firstName,
              last_name: this.lastName
            })
            .then(() => {
              this.success = true
              this.logout()
            })
            .catch(() => {
              this.error = true
            })
            .finally(() => {
              this.updating = false
              this.$emit('edit-close')
            })
        }
      } else {
        this.usernameInvalid = true
      }
    }
  }
}
</script>

<style></style>
