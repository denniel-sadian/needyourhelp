<template>
  <transition name="layout" mode="out-in">
    <v-app dark app>
      <v-toolbar id="nav" app flat>
        <v-img
          v-show="$route.name != 'index'"
          src="/images/logo.png"
          width="42"
          height="42"
          max-height="42"
          max-width="42"
          style="border: 2px solid white; border-radius: 100%"
          @click="$router.push({ name: 'index' })"
        ></v-img>
        <v-toolbar-title
          style="margin-left: 10px"
          @click="$router.push({ name: 'index' })"
          ><v-icon v-show="$route.name == 'index'">favorite</v-icon> Need Your
          Help</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn to="/topics" flat> Topics</v-btn>
          <v-btn to="/about" flat>About</v-btn>
          <v-btn
            v-show="!userFullName"
            flat
            @click="showRegister = !showRegister"
            >Register</v-btn
          >
          <v-btn v-show="!userFullName" flat @click="showLogin = !showLogin"
            >Login</v-btn
          >
          <v-menu v-show="userFullName" offset-y>
            <v-btn slot="activator" flat class="title yellow--text">{{
              userFullName
            }}</v-btn>
            <v-list>
              <v-list-tile @click="logout()">
                <v-list-tile-action>
                  <v-icon>exit_to_app</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-toolbar-side-icon
          class="hidden-md-and-up"
          @click="showNav = !showNav"
        ></v-toolbar-side-icon>
      </v-toolbar>

      <v-navigation-drawer
        v-model="showNav"
        app
        right
        hidden-md-only
        hidden-lg-only
        hidden-xl-only
        temporary
      >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar v-show="userFullName">
                <img
                  src="/images/avatar.png"
                  style="border: 2px solid white; border-radius: 100%"
                />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-if="userFullName" class="title">{{
                  userFullName
                }}</v-list-tile-title>
                <v-list-tile-title v-else class="title"
                  >Application's Drawer</v-list-tile-title
                >
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <v-list dense pt-0>
          <v-divider light></v-divider>
          <v-list-tile @click="$router.push({ name: 'topics' })">
            <v-list-tile-action>
              <v-icon>view_list</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Topics</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="$router.push({ name: 'about' })">
            <v-list-tile-action>
              <v-icon>info</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>About</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-show="userFullName"
            @click="
              logout()
              showNav = !showNav
            "
          >
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-show="!userFullName"
            @click="
              showLogin = !showLogin
              showNav = !showNav
            "
          >
            <v-list-tile-action>
              <v-icon>radio_button_checked</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Login</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-show="!userFullName"
            @click="
              showRegister = !showRegister
              showNav = !showNav
            "
          >
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Register</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <nuxt />
      </v-content>
      <LoginForm :show-login="showLogin" @login-close="showLogin = false" />
      <RegisterForm
        :show-register="showRegister"
        @register-close="showRegister = false"
      />
      <Footer />
      <v-snackbar
        v-model="expired"
        :timeout="5000"
        color="orange"
        top
        multi-line
        class="subheading"
      >
        Oh, that's unfortunate. Your session has expired. Please login again.
        <v-btn fab flat @click="$store.commit('SET_EXPIRED', false)">
          <v-icon>check_circle</v-icon>
        </v-btn>
      </v-snackbar>
    </v-app>
  </transition>
</template>

<script>
import getAuth from '~/utils/getAuth.js'

import Footer from '~/components/Footer.vue'
import LoginForm from '~/components/LoginForm.vue'
import RegisterForm from '~/components/RegisterForm.vue'

export default {
  transition: 'layout',
  middleware: 'auth',
  components: {
    Footer,
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      showNav: false,
      showLogin: false,
      showRegister: false
    }
  },
  computed: {
    userFullName() {
      if (this.$store.getters.auth.username) {
        return `${this.$store.getters.auth.first_name} ${
          this.$store.getters.auth.last_name
        }`
      } else return false
    },
    expired() {
      return this.$store.getters.expired
    }
  },
  async mounted() {
    await getAuth(this.$store)
  },
  methods: {
    logout() {
      this.$store.commit('SET_TOKEN', '')
      this.$store.commit('SET_AUTH', {})
      localStorage.removeItem('needyourhelp_access')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
#header,
#nav {
  background: url('../assets/images/header.jpg') !important;
  background-attachment: fixed !important;
  background-size: cover !important;
  background-position: center !important;
}
</style>
