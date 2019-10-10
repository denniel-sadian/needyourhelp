<template>
  <v-container grid-list-xs pb-0>
    <v-layout column>
      <v-flex>
        <div class="title">
          {{ question.text }}
        </div>
      </v-flex>
      <v-flex mt-2>
        <v-textarea
          v-model="opinion"
          d-flex
          outline
          label="Your opinion here"
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
      opinion: '',
      added: false
    }
  },
  computed: {
    respondLink() {
      return `http://127.0.0.1:8080/topics/${this.question.topic}/questions/${
        this.question.id
      }/respond/`
    }
  },
  watch: {
    opinion(v) {
      if ((v !== '') & !this.added) {
        this.added = true
        this.$store.commit('INCREMENT_VERIFIED_QUESTIONS')
      } else if (v === '') {
        this.added = false
        this.$store.commit('DECREMENT_VERIFIED_QUESTIONS')
      }
    },
    submit(v) {
      if (v) {
        this.$store.commit('ADD_TO_SUBMIT', {
          postURL: this.respondLink,
          data: {
            first_name: this.firstname,
            last_name: this.lastname,
            text: this.opinion
          }
        })
        this.$store.commit('INCREMENT_PREPARED_QUESTIONS')
      }
    }
  }
}
</script>
