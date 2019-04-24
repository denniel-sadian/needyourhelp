<template>
  <v-container grid-list-xs my-5>
    <div class="display-2 text-xs-center">{{ topic.title }}</div>
    <div class="headline mt-5 text-xs-center">
      Topic by:
      {{ (topic.owner_firstname + ' ' + topic.owner_lastname).toUpperCase() }}
    </div>
    <div class="subheading mt-3 text-xs-center">{{ topic.description }}</div>

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
        <v-container grid-list-xs>
          <div class="subheading">{{ q.question }}</div>
          <v-layout row>
            <v-flex xs12>
              <template v-for="a in q.answers">
                <v-card :key="a.respondent + a.answer" flat class="pa-2">
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
                <v-divider :key="a.answer + a.respondent"></v-divider>
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
        <v-container grid-list-xs>
          <div class="subheading">{{ m.question }}</div>
          <div v-show="m.choose_all" class="caption">
            The respondents were asked to choose all that applies, so some
            choices might have same percents.
          </div>
          <v-layout row>
            <v-flex xs12>
              <template v-for="c in m.choices">
                <v-card :key="c.counts + Math.random()" flat class="pa-2">
                  <v-layout row text-sm-center wrap>
                    <v-flex xs4 md3 order-xs2 order-md1 text-xs-center>
                      <div class="caption grey--text">Choice</div>
                      <div class="subheading">{{ c.choice }}</div>
                    </v-flex>
                    <v-flex xs12 md3 order-xs1 order-md2>
                      <div class="caption grey--text">Length</div>
                      <div class="subheading">
                        <v-progress-linear
                          color="yellow"
                          :value="c.percent"
                        ></v-progress-linear>
                      </div>
                    </v-flex>
                    <v-flex xs4 md3 order-xs3 text-xs-center>
                      <div class="caption grey--text">Percent</div>
                      <div class="subheading">{{ c.percent }}%</div>
                    </v-flex>
                    <v-flex xs4 md3 order-xs4 text-xs-center>
                      <div class="caption grey--text">Counts</div>
                      <div class="subheading">{{ c.counts }}</div>
                    </v-flex>
                  </v-layout>
                </v-card>
                <v-divider :key="c.choice + c.counts.toString()"></v-divider>
              </template>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>

    <!---
    
    --->
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
      respondents: [],
      total_respondents: 0,
      questions: [],
      multiple_choice_questions: [],
      topic: {}
    }
  },
  async asyncData({ params, store }) {
    let data
    const config = {
      baseURL: 'https://needyourhelp-api.herokuapp.com/'
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
  }
}
</script>
