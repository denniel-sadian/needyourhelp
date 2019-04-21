<template>
  <v-container grid-list-xs py-4>
    <v-layout column>
      <v-flex>
        <div class="title">
          {{ question.text }}
        </div>
        <div v-show="question.multiple" class="grey--text caption">
          You can choose all the applies.
        </div>
      </v-flex>
      <v-flex mt-2>
        <v-container py-0>
          <v-layout column>
            <v-flex v-if="question.multiple">
              <v-checkbox
                v-for="c in question.choices"
                :key="c.id"
                v-model="chosenChoices"
                hide-details
                :label="c.text"
                :value="c.id"
              ></v-checkbox>
            </v-flex>
            <v-flex v-else>
              <v-radio-group v-model="chosenOne">
                <v-radio
                  v-for="c in question.choices"
                  :key="c.id"
                  :label="c.text"
                  :value="c.id"
                ></v-radio>
              </v-radio-group>
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
  props: {
    question: {
      type: Object,
      default: () => {}
    },
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    },
    submit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      added: false,
      chosenOne: null,
      chosenChoices: []
    }
  },
  watch: {
    chosenOne(v) {
      if (!this.question.multiple) {
        if ((v !== null) & !this.added) {
          this.added = true
          this.$store.commit('INCREMENT_VERIFIED_QUESTIONS')
        } else if (v === null) {
          this.added = false
          this.$store.commit('DECREMENT_VERIFIED_QUESTIONS')
        }
      }
    },
    chosenChoices(v) {
      if (this.question.multiple) {
        if (v.length & !this.added) {
          this.added = true
          this.$store.commit('INCREMENT_VERIFIED_QUESTIONS')
        } else if (!v.length) {
          this.added = false
          this.$store.commit('DECREMENT_VERIFIED_QUESTIONS')
        }
      }
    },
    async submit(v) {
      if (v) {
        if (this.question.multiple) {
          for (const i in this.chosenChoices) {
            await axios.post(this.buildChooseUrl(this.chosenChoices[i]), {
              first_name: this.firstname,
              last_name: this.lastname
            })
          }
          this.$store.commit('INCREMENT_SUBMITTED_RESPONSE')
        } else {
          await axios
            .post(this.buildChooseUrl(this.chosenOne), {
              first_name: this.firstname,
              last_name: this.lastname
            })
            .then(() => {
              this.$store.commit('INCREMENT_SUBMITTED_RESPONSE')
            })
        }
      }
    }
  },
  methods: {
    buildChooseUrl(choiceID) {
      return `http://127.0.0.1:8000/topics/${
        this.question.topic
      }/multiplechoices/${this.question.id}/choices/${choiceID}/choose/`
    }
  }
}
</script>
