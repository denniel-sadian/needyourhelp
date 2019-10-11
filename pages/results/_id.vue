<template>
  <v-container grid-list-xs my-5>
    <div class="display-2 text-xs-center">{{ topic.title }}</div>
    <div class="headline mt-5 text-xs-center">
      Topic by:
      {{ (topic.owner_firstname + ' ' + topic.owner_lastname).toUpperCase() }}
    </div>
    <div class="subheading mt-3 text-xs-center">{{ topic.description }}</div>
    <div class="subheading mt-3 text-xs-center">
      This topic was created on
      {{ new Date(topic.date_started).toDateString() }}.
    </div>

    <v-layout row wrap mt-5>
      <v-flex xs12>
        <h1 class="title">
          <v-icon>list</v-icon> Respondents ({{ total_respondents }})
        </h1>
      </v-flex>
      <v-flex xs12>
        <template v-for="r in respondents">
          <v-card :key="r.name" flat class="pa-2">
            <v-layout row text-xs-center>
              <v-flex xs6>
                <div class="caption grey--text">Name</div>
                <div class="body-1">{{ r.name }}</div>
              </v-flex>
              <v-flex xs6>
                <div class="caption grey--text">When</div>
                <div class="body-1">
                  {{ new Date(r.when).toDateString() }}
                </div>
              </v-flex>
            </v-layout>
          </v-card>
          <v-divider :key="r.when + r.name"></v-divider>
        </template>
      </v-flex>
    </v-layout>

    <v-layout v-show="questions.length > 0" row wrap mt-5>
      <v-flex xs12>
        <h1 class="title"><v-icon>list</v-icon> Opinions to the questions</h1>
      </v-flex>
      <v-flex v-for="q in questions" :key="q.question" xs12>
        <v-container grid-list-xs class="question">
          <div class="headline">{{ q.question }}</div>
          <v-layout row>
            <v-flex xs12>
              <template v-for="a in q.answers">
                <v-card
                  :key="a.respondent + a.answer"
                  flat
                  class="pa-2 light-purple mb-3"
                >
                  <v-layout row text-sm-center wrap>
                    <v-flex xs12 sm6>
                      <div class="caption grey--text">Respondent</div>
                      <div class="body-1">{{ a.respondent }}</div>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <div class="caption grey--text">Answer</div>
                      <div class="body-1">
                        {{ a.answer }}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </template>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>

    <v-layout v-show="multiple_choice_questions.length > 0" row wrap mt-5>
      <v-flex xs12>
        <h1 class="title"><v-icon>list</v-icon> Multiple choices</h1>
      </v-flex>
      <v-flex v-for="m in multiple_choice_questions" :key="m.question" xs12>
        <v-container grid-list-xs class="question">
          <div class="headline">{{ m.question }}</div>
          <div v-show="m.choose_all" class="caption">
            The respondents were asked to choose all that applies, so some
            choices might have same percents.
          </div>
          <v-layout row>
            <v-flex xs12>
              <template v-for="c in m.choices">
                <v-card
                  :key="c.counts + Math.random()"
                  flat
                  class="pa-2 mb-3 light-purple"
                >
                  <v-layout row wrap>
                    <v-flex xs12 mb-2>
                      <div class="caption grey--text">Choice</div>
                      <div class="title">{{ c.choice }}</div>
                    </v-flex>
                    <v-flex xs8>
                      <div class="caption grey--text">Bar</div>
                      <div class="subheading">
                        <v-progress-linear
                          color="teal"
                          :value="c.percent"
                        ></v-progress-linear>
                      </div>
                    </v-flex>
                    <v-flex xs2 text-xs-center>
                      <div class="caption grey--text">Percent</div>
                      <div class="subheading">{{ c.percent }}%</div>
                    </v-flex>
                    <v-flex xs2 text-xs-center>
                      <div class="caption grey--text">Counts</div>
                      <div class="subheading">{{ c.counts }}</div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </template>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'shouldShowResults',
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      total_respondents: 0,
      questions: [],
      respondents: [],
      multiple_choice_questions: [],
      topic: {}
    }
  },
  computed: {
    title() {
      return `Results - ${this.topic.title}`
    },
    headDesc() {
      return this.topic.description
    }
  },
  async asyncData({ params, store }) {
    let data
    const config = {
      baseURL: 'http://127.0.0.1:8080/'
    }
    if (store.getters.token) {
      config.headers = {
        Authorization: `Bearer ${store.getters.token}`
      }
    }
    const client = axios.create(config)
    await client.get(`topics/${params.id}/results/`).then(res => {
      data = res.data
      for (const q in data.multiple_choice_questions) {
        const question = data.multiple_choice_questions[q]
        question.choices = question.choices.sort((a, b) => b.counts - a.counts)
      }
    })
    return data
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.headDesc
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: this.title
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: this.headDesc
        },
        {
          hid: 'twitter-preview_img',
          name: 'twitter:image',
          content: 'https://needyourhelp.herokuapp.com/images/hands.png'
        },
        {
          hid: 'preview_img',
          property: 'og:image',
          content: 'https://needyourhelp.herokuapp.com/images/hands.png'
        },
        {
          hid: 'site_url',
          property: 'og:url',
          content: `https://needyourhelp.herokuapp.com/results/${this.id}`
        },
        {
          hid: 'site_title',
          property: 'og:title',
          content: this.title
        },
        {
          hid: 'site_description',
          property: 'og:description',
          content: this.headDesc
        }
      ]
    }
  }
}
</script>

<style scoped>
.question {
  border: 2px solid gray;
  margin-bottom: 15px;
  border-radius: 10px;
}
.light-purple {
  background: rgb(237, 237, 255);
  border: 2px solid gray;
  border-radius: 10px;
}
</style>
