<template>
  <v-app dark>
    <v-toolbar>
      <v-toolbar-side-icon></v-toolbar-side-icon>

      <v-toolbar-title>Need Your Help</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>Topics</v-btn>
        <v-btn flat>About</v-btn>
        <v-btn flat>Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
