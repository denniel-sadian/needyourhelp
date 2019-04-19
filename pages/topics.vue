<template>
  <v-container container mt-5>
    <v-layout row wrap>
      <v-flex xs12>
        <h1 class="title"><v-icon>list</v-icon> Topics</h1>
      </v-flex>
      <v-flex xs12 text-xs-right>
        <div class="hidden-xs-only">
          <v-btn outline round @click="navigateToCreationPage()"
            >Create Topic <v-icon right>note_add</v-icon></v-btn
          >
          <v-btn
            v-show="username"
            :outline="!showOnlyMyTopics"
            round
            :class="{
              yellow: showOnlyMyTopics,
              'black--text': showOnlyMyTopics
            }"
            @click="showOnlyMyTopics = !showOnlyMyTopics"
            >My Topics <v-icon right>view_list</v-icon></v-btn
          >
        </div>
        <div class="hidden-sm-and-up">
          <v-btn fab outline small @click="navigateToCreationPage()"
            ><v-icon>note_add</v-icon></v-btn
          >
          <v-btn
            :outline="!showOnlyMyTopics"
            round
            :class="{
              yellow: showOnlyMyTopics,
              'black--text': showOnlyMyTopics
            }"
            fab
            small
            @click="showOnlyMyTopics = !showOnlyMyTopics"
            ><v-icon>view_list</v-icon></v-btn
          >
        </div>
      </v-flex>
      <v-flex xs12 mt-3>
        <template v-for="(topic, index) in topics">
          <v-card :key="topic.title" flat class="pa-3">
            <v-layout row wrap>
              <v-flex xs12 md3>
                <div class="caption grey--text">Topic Title</div>
                <div class="subheading">{{ topic.title }}</div>
              </v-flex>
              <v-flex xs12 md3>
                <div class="caption grey--text">Description</div>
                <div>{{ topic.description.slice(0, 100) + '...' }}</div>
              </v-flex>
              <v-flex xs6 md2>
                <div class="caption grey--text">Topic Owner</div>
                <div v-if="topic.owner !== username">
                  {{ topic.owner_firstname + ' ' + topic.owner_lastname }}
                </div>
                <div v-else>
                  You
                </div>
              </v-flex>
              <v-flex xs6 md2 text-xs-center>
                <div class="caption grey--text">Date Started</div>
                <div>
                  {{ new Date(topic.date_started).toDateString() }}
                </div>
              </v-flex>
              <v-flex xs10 md1 text-md-center>
                <div class="caption grey--text">Status</div>
                <div>
                  <v-chip v-if="topic.done" small class="green">Done</v-chip>
                  <v-chip v-else small class="orange">On going</v-chip>
                </div>
              </v-flex>
              <v-flex xs2 md1 text-xs-center>
                <div class="caption grey--text">Action</div>
                <div>
                  <v-btn
                    fab
                    flat
                    small
                    :disabled="topic.owner !== username"
                    @click="$router.push(`/edit/${topic.id}/`)"
                    ><v-icon>edit</v-icon></v-btn
                  >
                </div>
              </v-flex>
            </v-layout>
          </v-card>
          <v-divider :key="index"></v-divider>
        </template>
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="noUser"
      :timeout="6000"
      color="pink"
      top
      multi-line
      class="subheading"
    >
      Oh, there's no user logged in. You can't create topics unless you login or
      register.
      <v-btn fab flat @click="noUser = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showOnlyMyTopics: false,
      noUser: false
    }
  },
  computed: {
    username() {
      if (this.$store.getters.auth.username) {
        return this.$store.getters.auth.username
      } else return false
    },
    topics() {
      if (this.showOnlyMyTopics) {
        return this.$store.getters.topics.filter(t => {
          return t.owner === this.username
        })
      }
      return this.$store.getters.topics
    }
  },
  methods: {
    navigateToCreationPage() {
      if (this.username) {
        this.$router.push('create')
      } else this.noUser = true
    }
  }
}
</script>

<style scoped></style>
