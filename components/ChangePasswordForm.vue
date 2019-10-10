<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="showChangePassword" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"> <v-icon>lock</v-icon>Change password </span>
          </v-card-title>
          <v-card-text>
            <v-layout column wrap>
              <v-flex>
                <v-text-field
                  v-model="current"
                  outline
                  label="Current password"
                  type="password"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="first"
                  outline
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="final"
                  outline
                  label="Re-type password"
                  type="password"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="pink" flat @click="$emit('change-password-close')"
              >Cancel</v-btn
            >
            <v-btn
              color="green"
              flat
              :loading="updating"
              @click="changePassword()"
              >Change</v-btn
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
      Your password had been changed. You need to logout and login again.
      <v-btn fab flat @click="success = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="wrongPassword"
      :timeout="6000"
      color="pink"
      top
      multi-line
      class="subheading"
    >
      Your current password was wrong
      <v-btn fab flat @click="wrongPassword = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="didNotMatch"
      :timeout="5000"
      color="pink"
      top
      class="subheading"
      multi-line
    >
      Your passwords did not match.
      <v-btn fab flat @click="didNotMatch = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    showChangePassword: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      current: '',
      first: '',
      final: '',
      didNotMatch: false,
      wrongPassword: false,
      success: false,
      updating: false
    }
  },
  computed: {
    token() {
      return this.$store.getters.token
    },
    client() {
      const client = axios.create({
        baseURL: 'http://127.0.0.1:8080/',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      return client
    }
  },
  methods: {
    logout() {
      this.$store.commit('SET_TOKEN', '')
      this.$store.commit('SET_AUTH', {})
      localStorage.removeItem('needyourhelp_access')
      this.$router.push('/')
    },
    async changePassword() {
      if ((this.current !== '') & (this.first !== '') & (this.final !== '')) {
        this.updating = true
        await this.client
          .put('auth/change-password/', {
            password: this.current,
            password1: this.first,
            password2: this.final
          })
          .then(() => {
            this.success = true
            this.logout()
          })
          .catch(() => (this.wrongPassword = true))
          .finally(() => {
            this.updating = false
            this.current = ''
            this.first = ''
            this.final = ''
            this.$emit('change-password-close')
          })
      }
    }
  }
}
</script>

<style></style>
