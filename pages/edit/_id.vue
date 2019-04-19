<template>
  <v-container grid-list-xs mt-5>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="title">Edit topic</div>
      </v-flex>
      <v-flex d-flex xs12 pt-5>
        <v-text-field
          v-model="title"
          label="Topic title"
          outline
        ></v-text-field>
      </v-flex>
      <v-flex d-flex xs12>
        <v-text-field
          v-model="date"
          label="Date started"
          outline
        ></v-text-field>
      </v-flex>
      <v-flex d-flex xs12>
        <v-select
          v-model="done"
          :items="[true, false]"
          label="Done"
          outline
        ></v-select>
      </v-flex>
      <v-flex d-flex xs12>
        <v-textarea
          v-model="desc"
          d-flex
          outline
          label="Topic Description"
        ></v-textarea>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex xs12 sm6 pa-1 mt-4>
            <div class="subheading text-xs-center">
              Opinion-answered questions
            </div>
            <template v-for="q in questions_">
              <v-card :key="q.text" flat class="pa-3">
                <v-layout row>
                  <v-flex xs8>
                    <div class="caption grey--text">Question</div>
                    <div class="subheading">{{ q.text }}</div>
                  </v-flex>
                  <v-flex xs2 text-xs-center>
                    <div class="caption grey--text">Delete</div>
                    <div>
                      <v-btn
                        fab
                        flat
                        small
                        @click="
                          questionIDToDelete = q.id
                          confirmDeleteModal = !confirmDeleteModal
                        "
                        ><v-icon>cancel</v-icon></v-btn
                      >
                    </div>
                  </v-flex>
                  <v-flex xs2 text-xs-center>
                    <div class="caption grey--text">Edit</div>
                    <div>
                      <v-btn
                        fab
                        flat
                        small
                        @click="
                          edittingQuestionID = q.id
                          question = q.text
                          questionModal = !questionModal
                        "
                        ><v-icon>edit</v-icon></v-btn
                      >
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-divider :key="q.id + ' question'"></v-divider>
            </template>
            <div class="text-xs-center">
              <v-btn
                outline
                round
                @click="
                  rawAddQuestionModal = !rawAddQuestionModal
                  question = ''
                "
                ><v-icon left>note_add</v-icon> Add Question</v-btn
              >
            </div>
          </v-flex>
          <v-flex xs12 sm6 pa-1 mt-4>
            <div class="subheading text-xs-center">
              Multiple choice questions
            </div>
            <template v-for="q in multiples_">
              <v-card :key="q.text" flat class="pa-3">
                <v-layout row wrap>
                  <v-flex xs12 sm5>
                    <div class="caption grey--text">Question</div>
                    <div class="subheading">{{ q.text }}</div>
                  </v-flex>
                  <v-flex xs12 sm5 text-sm-center>
                    <div class="caption grey--text">Choices</div>
                    <div>
                      <v-chip
                        v-for="c in q.choices"
                        :key="String(Math.random()) + c.text + 'choice'"
                        >{{ c.text }}</v-chip
                      >
                    </div>
                  </v-flex>
                  <v-flex xs8 sm2 text-xs-left text-sm-center>
                    <div class="caption grey--text">Choose all</div>
                    <div v-if="q.multiple" class="subheading">Yes</div>
                    <div v-else class="subheading">No</div>
                  </v-flex>
                  <v-flex xs2 sm6 text-xs-center>
                    <div class="caption grey--text">Delete</div>
                    <div>
                      <v-btn
                        fab
                        flat
                        small
                        @click="
                          questionIDToDelete = q.id
                          confirmDeleteModalSecond = true
                        "
                        ><v-icon>cancel</v-icon></v-btn
                      >
                    </div>
                  </v-flex>
                  <v-flex xs2 sm6 text-xs-center>
                    <div class="caption grey--text">Edit</div>
                    <div>
                      <v-btn fab flat small @click="prepareMultipleChoice(q)"
                        ><v-icon>edit</v-icon></v-btn
                      >
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-divider :key="q.id + ' question'"></v-divider>
            </template>
            <div class="text-xs-center">
              <v-btn
                outline
                round
                @click="rawMultiplechoiceModal = !rawMultiplechoiceModal"
                ><v-icon left>note_add</v-icon> Add Multiple choice</v-btn
              >
            </div>
          </v-flex>
          <v-flex xs12 md6 mt-3 pa-2>
            <v-btn block class="green" round @click="save()">Save</v-btn>
          </v-flex>
          <v-flex xs12 md6 mt-3 pa-2>
            <v-btn block round class="pink" @click="deleteModal = !deleteModal"
              >Delete</v-btn
            >
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="deleteModal" persistent max-width="290">
        <v-card>
          <v-card-title class="headline"
            >Are you sure you want to delete this topic?</v-card-title
          >
          <v-card-text
            >Once you delete this topic, you will not be able to bring it back
            again!</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="pink" flat @click="deleteModal = !deleteModal"
              >Nope</v-btn
            >
            <v-btn color="green" flat @click="deleteTopic()">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="confirmDeleteModal" persistent max-width="290">
        <v-card>
          <v-card-title class="headline"
            >Are you sure you want to delete this question?</v-card-title
          >
          <v-card-text
            >Once you delete this question, you will not be able to bring it
            back again! Well, unless you create a new one.</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="pink"
              flat
              @click="confirmDeleteModal = !confirmDeleteModal"
              >Nope</v-btn
            >
            <v-btn
              color="green"
              flat
              @click="deleteQuestion(questionIDToDelete)"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="confirmDeleteModalSecond" persistent max-width="290">
        <v-card>
          <v-card-title class="headline"
            >Are you sure you want to delete this multiple choice
            question?</v-card-title
          >
          <v-card-text
            >Once you delete this question, you will not be able to bring it
            back again! Well, unless you create a new one.</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="pink"
              flat
              @click="confirmDeleteModalSecond = !confirmDeleteModalSecond"
              >Nope</v-btn
            >
            <v-btn
              color="green"
              flat
              @click="deleteMultiple(questionIDToDelete)"
              >Yes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="questionModal" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"
              ><v-icon>edit</v-icon> Editting a question</span
            >
          </v-card-title>
          <v-card-text>
            <v-layout column>
              <v-flex>
                <v-text-field
                  v-model="question"
                  outline
                  label="Question"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round class="pink" @click="questionModal = false"
              >Cancel</v-btn
            >
            <v-btn round class="green" @click="editQuestion()">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="multiplechoiceModal" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"
              ><v-icon>edit</v-icon> Edit a multiple choice question</span
            >
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="question"
                  outline
                  label="Question"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="questionMultiple"
                  :items="[false, true]"
                  outline
                  label="Respondents can choose all?"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="choice"
                  outline
                  label="Choice"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs8>
                <div class="text-xs-center">
                  <v-chip
                    v-for="c in choices"
                    :key="c.id + c.text"
                    close
                    @input="removeChoice(c.id)"
                    >{{ c.text }}</v-chip
                  >
                </div>
              </v-flex>
              <v-flex xs4 text-xs-right>
                <v-btn outline @click="addChoice()">Add Choice</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round class="pink" @click="multiplechoiceModal = false"
              >Cancel</v-btn
            >
            <v-btn round class="green" @click="editMultipleChoice()"
              >Update</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="rawAddQuestionModal" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"
              ><v-icon>note_add</v-icon> Add a question</span
            >
          </v-card-title>
          <v-card-text>
            <v-layout column>
              <v-flex>
                <v-text-field
                  v-model="question"
                  outline
                  label="Question"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round class="pink" @click="rawAddQuestionModal = false"
              >Cancel</v-btn
            >
            <v-btn round class="green" @click="addQuestion()">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="rawMultiplechoiceModal" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline"
              ><v-icon>note_add</v-icon> Add a multiple choice question</span
            >
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="question"
                  outline
                  label="Question"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="questionMultiple"
                  :items="[false, true]"
                  outline
                  label="Respondents can choose all?"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="choice"
                  outline
                  label="Choice"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs8>
                <div class="text-xs-center">
                  <v-chip
                    v-for="c in rawChoices"
                    :key="c"
                    close
                    @input="rawRemoveChoice(c)"
                    >{{ c }}</v-chip
                  >
                </div>
              </v-flex>
              <v-flex xs4 text-xs-right>
                <v-btn outline @click="addRawChoice()">Add Choice</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn round class="pink" @click="rawMultiplechoiceModal = false"
              >Cancel</v-btn
            >
            <v-btn round class="green" @click="addRawMultipleChoice()"
              >Add</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-snackbar
      v-model="error"
      :timeout="10000"
      color="pink"
      top
      multi-line
      class="subheading"
    >
      There was an error. It is either your session has expired or you are
      unauthorized to access this topic.
      <v-btn fab flat @click="error = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      id: null,
      title: '',
      desc: '',
      date: null,
      done: false,
      questions: [],
      multiples: [],
      deleteModal: false,
      edittingQuestionID: null,
      questionModal: false,
      question: '',
      questionIDToDelete: null,
      multiplechoiceModal: false,
      rawMultiplechoiceModal: false,
      choices: [],
      rawChoices: [],
      choice: '',
      questionMultiple: false,
      rawAddQuestionModal: false,
      confirmDeleteModal: false,
      confirmDeleteModalSecond: false,
      error: false
    }
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
    topicURL() {
      return `topics/${this.id}/`
    },
    questionsURL() {
      return `${this.topicURL}questions/`
    },
    multiplechoicesURL() {
      return `${this.topicURL}multiplechoices/`
    },
    questions_() {
      return this.questions
    },
    multiples_() {
      return this.multiples
    }
  },
  async asyncData({ params }) {
    const root = `http://127.0.0.1:8000/topics/${params.id}/`
    const data = {}
    await axios
      .get(root)
      .then(res => {
        data.id = res.data.id
        data.title = res.data.title
        data.desc = res.data.description
        data.date = res.data.date_started
        data.done = res.data.done
      })
      .catch(() => {
        this.exposeError()
      })
    await axios
      .get(`${root}questions/`)
      .then(res => {
        data.questions = res.data
      })
      .catch(() => {
        this.exposeError()
      })
    await axios
      .get(`${root}multiplechoices/`)
      .then(res => {
        data.multiples = res.data
      })
      .catch(() => {
        this.exposeError()
      })
    for (const i in data.multiples) {
      await axios
        .get(`${root}multiplechoices/${data.multiples[i].id}/choices/`)
        .then(res => {
          data.multiples[i].choices = res.data
        })
    }
    return data
  },
  methods: {
    async getQuestions() {
      await this.client
        .get(this.questionsURL)
        .then(res => {
          this.questions = res.data
        })
        .catch(() => {
          this.exposeError()
        })
    },
    async getMultiples() {
      await this.client
        .get(this.multiplechoicesURL)
        .then(res => {
          this.multiples = res.data
        })
        .catch(() => {
          this.exposeError()
        })
      for (const m in this.multiples) {
        await this.client
          .get(`${this.multiplechoicesURL}${this.multiples[m].id}/choices/`)
          .then(res => {
            this.multiples[m].choices = res.data
          })
          .catch(() => {
            this.exposeError()
          })
      }
    },
    async deleteQuestion(id) {
      await this.client
        .delete(`${this.questionsURL}${id}/`)
        .then(() => {
          this.getQuestions()
          this.questionIDToDelete = null
          this.confirmDeleteModal = false
        })
        .catch(() => {
          this.exposeError()
        })
    },
    async deleteMultiple(id) {
      await this.client
        .delete(`${this.multiplechoicesURL}${id}/`)
        .then(() => {
          this.getMultiples()
          this.questionIDToDelete = null
          this.confirmDeleteModalSecond = false
        })
        .catch(() => {
          this.exposeError()
        })
    },
    async deleteTopic() {
      await this.client
        .delete(this.topicURL)
        .then(() => {
          this.$router.push('/topics')
        })
        .catch(() => {
          this.exposeError()
        })
    },
    async save() {
      await this.client
        .put(this.topicURL, {
          title: this.title,
          description: this.desc,
          date_started: this.data,
          done: this.done
        })
        .then(() => {
          this.$router.push('/topics')
        })
        .catch(() => {
          this.exposeError()
        })
    },
    async editQuestion() {
      if (this.question !== '') {
        await this.client
          .put(`${this.questionsURL}${this.edittingQuestionID}/`, {
            text: this.question,
            topic: this.id
          })
          .then(() => {
            this.getQuestions()
            this.questionModal = false
            this.question = ''
          })
          .catch(() => {
            this.exposeError()
          })
      }
    },
    async editMultipleChoice() {
      if ((this.question !== '') & (this.choices.length > 1)) {
        await this.client
          .patch(`${this.multiplechoicesURL}${this.edittingQuestionID}/`, {
            text: this.question,
            topic: this.id
          })
          .then(() => {
            this.getMultiples()
            this.multiplechoiceModal = false
            this.choices = []
            this.choice = ''
            this.question = ''
          })
          .catch(() => {
            this.exposeError()
          })
      }
    },
    async prepareMultipleChoice(q) {
      this.multiplechoiceModal = true
      this.question = q.text
      this.choices = []
      this.edittingQuestionID = q.id
      this.questionMultiple = q.multiple
      await this.client
        .get(`${this.multiplechoicesURL}${q.id}/choices/`)
        .then(res => {
          this.choices = res.data
        })
        .catch(() => {
          this.exposeError()
        })
    },
    async removeChoice(id) {
      await this.client.delete(
        `${this.multiplechoicesURL}${this.edittingQuestionID}/choices/${id}/`
      )
      await this.client
        .get(`${this.multiplechoicesURL}${this.edittingQuestionID}/choices/`)
        .then(res => {
          this.choices = res.data
          this.getMultiples()
        })
        .catch(() => {
          this.exposeError()
        })
    },
    async addChoice() {
      if (this.choice !== '') {
        await this.client
          .post(
            `${this.multiplechoicesURL}${this.edittingQuestionID}/choices/`,
            {
              question: this.edittingQuestionID,
              text: this.choice
            }
          )
          .then(async () => {
            await this.client
              .get(
                `${this.multiplechoicesURL}${this.edittingQuestionID}/choices/`
              )
              .then(res => {
                this.choices = res.data
                this.choice = ''
                this.getMultiples()
              })
              .catch(() => {
                this.exposeError()
              })
          })
          .catch(() => {
            this.exposeError()
          })
      }
    },
    async addQuestion() {
      if (this.question !== '') {
        await this.client
          .post(`${this.topicURL}questions/`, { text: this.question })
          .then(() => {
            this.getQuestions()
            this.question = ''
            this.rawAddQuestionModal = false
          })
      }
    },
    async addRawMultipleChoice() {
      if ((this.question !== '') & (this.rawChoices.length > 1)) {
        await this.client
          .post(`${this.topicURL}multiplechoices/`, {
            text: this.question,
            multiple: this.questionMultiple
          })
          .then(async res => {
            for (const c in this.rawChoices) {
              await this.client
                .post(`${this.multiplechoicesURL}${res.data.id}/choices/`, {
                  text: this.rawChoices[c],
                  question: res.data.id
                })
                .catch(() => {
                  this.exposeError()
                })
            }
            this.getMultiples()
            this.rawMultiplechoiceModal = false
          })
      }
    },
    addRawChoice() {
      if (this.choice) {
        this.rawChoices.push(this.choice)
        this.choice = ''
      }
    },
    rawRemoveChoice(c) {
      this.rawChoices.splice(this.rawChoices.indexOf(c), 1)
      this.rawChoices = [...this.rawChoices]
    },
    exposeError() {
      this.error = true
      this.$store.commit('SET_TOKEN', '')
      this.$store.commit('SET_AUTH', {})
    }
  }
}
</script>
