<template>
  <v-app dark>
    <v-toolbar id="nav" app flat>
      <v-img
        v-show="$route.name != 'index'"
        src="/images/logo.png"
        width="42"
        height="42"
        max-height="42"
        max-width="42"
        style="border: 2px solid white; border-radius: 100%"
        @click="$router.push('/')"
      ></v-img>
      <v-toolbar-title style="margin-left: 10px" @click="$router.push('/')"
        ><v-icon v-show="$route.name == 'index'">favorite</v-icon> Need Your
        Help</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn round to="topics" flat>Topics</v-btn>
        <v-btn round to="about" flat>About</v-btn>
        <v-btn round flat>Login</v-btn>
      </v-toolbar-items>
      <v-toolbar-side-icon
        class="hidden-md-and-up"
        @click="showNav = !showNav"
      ></v-toolbar-side-icon>
    </v-toolbar>

    <v-navigation-drawer v-model="showNav" app absolute temporary right>
      <v-list class="pt-0" dense>
        <v-list-tile>
          <v-list-tile-title class="title">
            Application Drawer
          </v-list-tile-title></v-list-tile
        >

        <v-divider light></v-divider>

        <v-list-tile @click="$router.push('topics')">
          <v-list-tile-action>
            <v-icon>view_list</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Topics</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="$router.push('topics')">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Topics</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>radio_button_checked</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <nuxt />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Footer
  },
  data() {
    return {
      showNav: false
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
