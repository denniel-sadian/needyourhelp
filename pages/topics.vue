<template>
  <v-container container mt-5>
    <v-layout row wrap>
      <v-flex xs12>
        <h1 class="title">
          <v-icon>list</v-icon> There <span v-if="topics.length > 1">are</span
          ><span v-else>is</span> {{ topics.length }} topic<span
            v-show="topics.length > 1"
            >s</span
          >.
        </h1>
      </v-flex>
      <v-flex xs12 mt-3>
        <v-text-field
          v-model="search"
          outline
          label="Search topic"
          hide-details
        ></v-text-field>
      </v-flex>
      <v-flex xs12 py-2>
        <v-select
          v-model="selectedFilter"
          hide-details
          :items="filters"
          label="Filter"
          outline
        ></v-select>
      </v-flex>
      <v-flex xs12 text-xs-right py-2>
        <v-btn outline block round @click="navigateToCreationPage()"
          >Create Topic <v-icon right>note_add</v-icon></v-btn
        >
      </v-flex>
      <v-flex v-if="topics.length > 0" xs12 mt-3>
        <template v-for="(topic, index) in pagedTopics">
          <v-card :key="topic.title" flat class="pa-3">
            <v-layout row wrap>
              <v-flex xs12 md3>
                <div class="caption grey--text">Topic Title</div>
                <div class="subheading">{{ topic.title }}</div>
              </v-flex>
              <v-flex xs12 md2>
                <div class="caption grey--text">Description</div>
                <div>{{ topic.description.slice(0, 100) + '...' }}</div>
              </v-flex>
              <v-flex xs6 md1>
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
              <v-flex xs3 md1 text-xs-center>
                <div class="caption grey--text">Status</div>
                <div>
                  <v-chip v-if="topic.done" small class="green">Done</v-chip>
                  <v-chip v-else small class="orange">On going</v-chip>
                </div>
              </v-flex>
              <v-flex xs3 md1 text-xs-center>
                <div class="caption grey--text">Edit</div>
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
              <v-flex xs3 md1 text-xs-center>
                <div class="caption grey--text">Results</div>
                <div>
                  <v-btn
                    fab
                    flat
                    small
                    :disabled="disableResults(topic)"
                    @click="$router.push(`/results/${topic.id}`)"
                    ><v-icon>list</v-icon></v-btn
                  >
                </div>
              </v-flex>
              <v-flex xs2 md1 text-xs-center>
                <div class="caption grey--text">Respond</div>
                <div>
                  <v-btn
                    fab
                    flat
                    small
                    :disabled="topic.done"
                    @click="respond(topic.id)"
                    ><v-icon>check_circle</v-icon></v-btn
                  >
                </div>
              </v-flex>
            </v-layout>
          </v-card>
          <v-divider :key="index"></v-divider>
        </template>
      </v-flex>
      <v-flex v-else xs12 text-xs-center mt-5>
        <div class="pink--text headline font-weight-black">
          No topic for this filter.
        </div>
      </v-flex>
    </v-layout>

    <v-container v-show="topics.length > size" grid-list-xs text-xs-center>
      <v-pagination
        v-model="page"
        circle
        color="purple"
        :length="max"
        :total-visible="5"
      ></v-pagination>
    </v-container>

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
    <v-snackbar
      v-model="respondedAlready"
      :timeout="6000"
      color="green"
      top
      multi-line
      class="subheading"
    >
      You have answered the questions in this topic already. Thanks for
      responding!
      <v-btn fab flat @click="respondedAlready = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  watchQuery: ['page'],
  middleware: 'getTopics',
  data() {
    return {
      filters: ['All topics', 'My topics', 'Done topics', 'On going topics'],
      search: '',
      selectedFilter: 'All topics',
      showOnlyMyTopics: false,
      noUser: false,
      respondedAlready: false,
      page: 1,
      size: 12
    }
  },
  computed: {
    max() {
      const raw = this.topics.length / this.size
      return Math.ceil(raw)
    },
    username() {
      if (this.$store.getters.auth.username) {
        return this.$store.getters.auth.username
      } else return false
    },
    firstname() {
      if (this.username)
        return this.$store.getters.auth.first_name.toLowerCase()
      else return false
    },
    lastname() {
      if (this.username) {
        return this.$store.getters.auth.last_name.toLowerCase()
      } else return false
    },
    computedPage() {
      let n = 0
      if (this.$route.query.page) {
        n = Number(this.$route.query.page) - 1
      }
      return n
    },
    pagedTopics() {
      const start = this.computedPage * this.size
      const end = start + this.size
      return this.topics.slice(start, end)
    },
    topics() {
      let topics = []
      if (this.selectedFilter === 'My topics')
        topics = this.$store.getters.topics.filter(
          t => t.owner === this.username
        )
      else if (this.selectedFilter === 'All topics')
        topics = this.$store.getters.topics
      else if (this.selectedFilter === 'Done topics')
        topics = this.$store.getters.topics.filter(t => t.done)
      else if (this.selectedFilter === 'On going topics')
        topics = this.$store.getters.topics.filter(t => !t.done)
      if (this.search !== '')
        topics = topics.filter(t =>
          t.title.toLowerCase().includes(this.search.toLowerCase())
        )
      return topics
    },
    headDesc() {
      return `We currently have ${this.veryTopicsCount} topics.
      Help your fellow people by giving some time to respond to their
      topics, that would be very lovely!`
    }
  },
  watch: {
    page(v) {
      const q = { page: v, filter: this.selectedFilter }
      if (this.search) q.search = this.search
      this.$router.push({ name: 'topics', query: q })
    },
    search() {
      this.page = 1
    },
    selectedFilter() {
      this.page = 1
    }
  },
  async asyncData({ query, store }) {
    const data = { page: 1 }
    if (query.page) data.page = Number(query.page)
    if (query.search) data.search = query.search
    if (query.filter) data.selectedFilter = query.filter
    data.veryTopicsCount = await store.getters.topics.length
    return data
  },
  methods: {
    navigateToCreationPage() {
      if (this.username) {
        this.$router.push('create')
      } else this.noUser = true
    },
    disableResults(topic) {
      if (this.username) {
        if (this.username !== topic.owner) return true
        else return false
      } else if (topic.done) return false
      else return true
    },
    goPrevious() {
      // this.$scrollTo('#projects', 0, { force: true })
      this.$router.push(this.previousLink)
    },
    goNext() {
      // this.$scrollTo('#projects', 0, { force: true })
      this.$router.push(this.nextLink)
    },
    async respond(id) {
      if (this.username) {
        await axios
          .post(`http://127.0.0.1:8000/topics/${id}/responded/`, {
            firstname: this.firstname,
            lastname: this.lastname
          })
          .then(res => {
            if (res.data.responded) this.respondedAlready = true
            else this.$router.push(`/respond/${id}/`)
          })
      } else this.$router.push(`/respond/${id}/`)
    }
  },
  head() {
    return {
      title: 'Need Your Help - Topics',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.headDesc
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: 'Need Your Help - Topics'
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: this.headDesc
        }
      ]
    }
  }
}
</script>
