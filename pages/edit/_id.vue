<template>
  <v-container grid-list-xs mt-5>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="display-2 text-xs-center font-weight-black pb-3">
          Edit topic
        </div>
        <v-alert :value="true" type="info" class="subheading">
          If this is your first time editing this topic, then you're fine to go.
          If not, then be sure that you haven't yet started the promotion of
          this topic's survey, because the validity of results might not be
          accurate. If you're only editing this topic for correcting some
          mistakes in grammar, pucntuation or spelling, then it's fine. But
          adding some questions or choices while some of your respondents have
          already responded, is prohibited for making sure that the survey will
          produce accurate results.
        </v-alert>
        <v-alert :value="true" type="info" class="subheading">
          Also, if you press the big green "Save" button, it only applies for
          saving the topic's title, date, status, and description in the
          database. Further editing of the questions are already saved in the
          database. So be careful.
        </v-alert>
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
          <v-flex xs12 md6 pa-1 mt-4>
            <div class="headline text-xs-center mb-3">
              Opinion-answered questions
            </div>
            <template v-for="q in questions_">
              <v-card :key="q.text" flat class="pa-3 light-gray mb-3">
                <v-layout row>
                  <v-flex xs8>
                    <div class="caption grey--text">Question</div>
                    <div class="title">{{ q.text }}</div>
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
          <v-flex xs12 md6 pa-1 mt-4>
            <div class="headline text-xs-center mb-3">
              Multiple choice questions
            </div>
            <template v-for="q in multiples_">
              <v-card :key="q.text" flat class="pa-3 mb-3 light-gray">
                <v-layout row wrap>
                  <v-flex xs10>
                    <div class="caption grey--text">Question</div>
                    <div class="title">{{ q.text }}</div>
                  </v-flex>
                  <v-flex xs2 text-xs-center>
                    <div class="caption grey--text">Choose all</div>
                    <div v-if="q.multiple" class="subheading">Yes</div>
                    <div v-else class="subheading">No</div>
                  </v-flex>
                  <v-flex xs12>
                    <div class="caption grey--text">Choices</div>
                    <div>
                      <v-chip
                        v-for="c in q.choices"
                        :key="String(Math.random()) + c.text + 'choice'"
                        >{{ c.text }}</v-chip
                      >
                    </div>
                  </v-flex>
                  <v-flex xs6 text-xs-center>
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
                  <v-flex xs6 text-xs-center>
                    <div class="caption grey--text">Edit</div>
                    <div>
                      <v-btn fab flat small @click="prepareMultipleChoice(q)"
                        ><v-icon>edit</v-icon></v-btn
                      >
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
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
            <v-btn
              block
              class="green"
              round
              :loading="saving"
              :disabled="disabled"
              @click="save()"
              >Save</v-btn
            >
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
            <v-btn
              color="green"
              flat
              :loading="deleting"
              :disabled="disabled"
              @click="deleteTopic()"
              >Yes</v-btn
            >
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
              :loading="workingWithQuestion"
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
              :loading="workingWithQuestion"
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
                  @keyup.enter="editQuestion()"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="pink" @click="questionModal = false"
              >Cancel</v-btn
            >
            <v-btn
              flat
              color="green"
              :loading="workingWithQuestion"
              @click="editQuestion()"
              >Update</v-btn
            >
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
                  @keyup.enter="addChoice()"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn outline :loading="addingChoice" @click="addChoice()"
                  >Add</v-btn
                >
                <v-btn outline :loading="updatingChoice" @click="editChoice()"
                  >Update</v-btn
                >
              </v-flex>
              <v-flex xs12>
                <div class="text-xs-center">
                  <v-chip
                    v-for="c in choices"
                    :key="c.id + c.text"
                    close
                    @click="prepareChoiceToEdit(c)"
                    @input="removeChoice(c.id)"
                    >{{ c.text }}</v-chip
                  >
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="pink" @click="multiplechoiceModal = false"
              >Cancel</v-btn
            >
            <v-btn
              flat
              color="green"
              :loading="workingWithQuestion"
              @click="editMultipleChoice()"
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
                  @keyup.enter="addQuestion()"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="pink" @click="rawAddQuestionModal = false"
              >Cancel</v-btn
            >
            <v-btn
              color="green"
              flat
              :loading="workingWithQuestion"
              @click="addQuestion()"
              >Add</v-btn
            >
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
                  @keyup.enter="addRawMultipleChoice()"
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
                  @keyup.enter="addRawChoice()"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn outline block @click="addRawChoice()">Add Choice</v-btn>
              </v-flex>
              <v-flex xs12>
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
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="pink" @click="rawMultiplechoiceModal = false"
              >Cancel</v-btn
            >
            <v-btn
              flat
              color="green"
              :loading="workingWithQuestion"
              @click="addRawMultipleChoice()"
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
      There was an error. Your session might be expired, you're trying to add a
      choice that has been added already, or simply, your not authorized to edit
      this topic.
      <v-btn
        fab
        flat
        @click="
          error = false
          $router.push($route.path)
        "
      >
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import getAuth from '~/utils/getAuth.js'
import axios from 'axios'

export default {
  middleware: 'checkOwnership',
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      id: null,
      date: null,
      choiceID: null,
      disabled: false,
      questionIDToDelete: null,
      edittingQuestionID: null,
      desc: '',
      title: '',
      choice: '',
      question: '',
      choices: [],
      questions: [],
      multiples: [],
      rawChoices: [],
      done: false,
      error: false,
      saving: false,
      deleting: false,
      deleteModal: false,
      addingChoice: false,
      questionModal: false,
      updatingChoice: false,
      questionMultiple: false,
      confirmDeleteModal: false,
      rawAddQuestionModal: false,
      workingWithQuestion: false,
      multiplechoiceModal: false,
      rawMultiplechoiceModal: false,
      confirmDeleteModalSecond: false,
      alert: true
    }
  },
  computed: {
    token() {
      return this.$store.getters.token
    },
    client() {
      const client = axios.create({
        baseURL: 'https://needyourhelp-api.herokuapp.com/',
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
    const root = `https://needyourhelp-api.herokuapp.com/topics/${params.id}/`
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
    prepareChoiceToEdit(c) {
      this.choice = c.text
      this.choiceID = c.id
    },
    async editChoice() {
      if ((this.choice !== '') & (this.choiceID !== null)) {
        this.updatingChoice = true
        await this.client
          .patch(
            `${this.multiplechoicesURL}${this.edittingQuestionID}/choices/${
              this.choiceID
            }/`,
            { text: this.choice }
          )
          .then(() => {
            this.choice = ''
            this.choiceID = null
            this.getChoicesOfEdittingQuestion(this.edittingQuestionID)
          })
          .catch(() => {
            this.exposeError()
          })
          .finally(() => (this.updatingChoice = false))
      }
    },
    async deleteQuestion(id) {
      this.workingWithQuestion = true
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
        .finally(() => (this.workingWithQuestion = false))
    },
    async deleteMultiple(id) {
      this.workingWithQuestion = true
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
        .finally(() => (this.workingWithQuestion = false))
    },
    async deleteTopic() {
      this.deleting = true
      this.disabled = true
      await this.client
        .delete(this.topicURL)
        .then(() => {
          this.$router.push('/topics')
        })
        .catch(() => {
          this.exposeError()
        })
        .finally(() => (this.deleting = false))
    },
    async save() {
      if (this.title && this.date && this.desc) {
        this.saving = true
        this.disabled = true
        await this.client
          .patch(this.topicURL, {
            title: this.title,
            description: this.desc,
            date_started: this.date,
            done: this.done
          })
          .then(() => {
            this.$router.push('/topics')
          })
          .catch(() => {
            this.exposeError()
          })
          .finally(() => (this.saving = false))
      }
    },
    async editQuestion() {
      if (this.question !== '') {
        this.workingWithQuestion = true
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
          .finally(() => (this.workingWithQuestion = false))
      }
    },
    async editMultipleChoice() {
      if ((this.question !== '') & (this.choices.length > 1)) {
        this.workingWithQuestion = true
        await this.client
          .patch(`${this.multiplechoicesURL}${this.edittingQuestionID}/`, {
            text: this.question,
            multiple: this.questionMultiple,
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
          .finally(() => (this.workingWithQuestion = false))
      }
    },
    async getChoicesOfEdittingQuestion(id) {
      await this.client
        .get(`${this.multiplechoicesURL}${id}/choices/`)
        .then(res => {
          this.choices = res.data
        })
        .catch(() => {
          this.exposeError()
        })
    },
    prepareMultipleChoice(q) {
      this.multiplechoiceModal = true
      this.question = q.text
      this.choices = []
      this.edittingQuestionID = q.id
      this.questionMultiple = q.multiple
      this.getChoicesOfEdittingQuestion(q.id)
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
        this.addingChoice = true
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
                this.choiceID = null
                this.getMultiples()
              })
              .catch(() => {
                this.exposeError()
              })
              .finally(() => (this.addingChoice = false))
          })
          .catch(() => {
            this.exposeError()
          })
          .finally(() => (this.addingChoice = false))
      }
    },
    async addQuestion() {
      this.workingWithQuestion = true
      if (this.question !== '') {
        await this.client
          .post(`${this.topicURL}questions/`, { text: this.question })
          .then(() => {
            this.getQuestions()
            this.question = ''
            this.rawAddQuestionModal = false
          })
          .catch(() => {
            this.exposeError()
          })
          .finally(() => (this.workingWithQuestion = false))
      }
    },
    async addRawMultipleChoice() {
      if ((this.question !== '') & (this.rawChoices.length > 1)) {
        this.workingWithQuestion = true
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
            this.rawChoices = []
            this.question = ''
            this.questionMultiple = false
          })
          .catch(() => {
            this.exposeError()
          })
          .finally(() => (this.workingWithQuestion = false))
      }
    },
    addRawChoice() {
      if (this.choice) {
        if (!this.rawChoices.includes(this.choice)) {
          this.rawChoices.push(this.choice)
        }
      }
      this.choice = ''
    },
    rawRemoveChoice(c) {
      this.rawChoices.splice(this.rawChoices.indexOf(c), 1)
      this.rawChoices = [...this.rawChoices]
    },
    async exposeError() {
      this.error = true
      await getAuth(this.$store)
    }
  },
  head() {
    return {
      title: this.title + ' - Editing',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Edit a topic in this page.'
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: this.title + ' - Editing'
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: 'Edit a topic in this page.'
        },
        {
          hid: 'site_url',
          property: 'og:url',
          content: `https://needyourhelp.herokuapp.com/edit/${this.id}`
        },
        {
          hid: 'site_title',
          property: 'og:title',
          content: this.title + ' - Editing'
        },
        {
          hid: 'site_description',
          property: 'og:description',
          content: 'Edit a topic in this page.'
        }
      ]
    }
  }
}
</script>

<style>
.v-chip__content {
  white-space: unset !important;
  height: unset !important;
  min-height: 32px !important;
}
</style>

<style scoped>
.light-gray {
  background: rgb(237, 237, 255);
  border: 2px solid teal;
  border-radius: 10px;
}
</style>
