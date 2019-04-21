import axios from 'axios'

export const state = () => ({
  topics: [],
  auth: {},
  token: '',
  verifiedQuestions: 0,
  submitted: 0
})

export const mutations = {
  SET_TOPICS(state, topics) {
    state.topics = topics
  },
  SET_AUTH(state, auth) {
    state.auth = auth
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  INCREMENT_VERIFIED_QUESTIONS(state) {
    state.verifiedQuestions++
  },
  DECREMENT_VERIFIED_QUESTIONS(state) {
    state.verifiedQuestions--
  },
  CLEAR_VERIFIED_QUESTIONS(state) {
    state.verifiedQuestions = 0
  },
  INCREMENT_SUBMITTED_RESPONSE(state) {
    state.submitted++
  },
  CLEAR_SUBMITTED_RESPONSE(state) {
    state.submitted = 0
  }
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('getTopics')
  },
  async getTopics({ commit }) {
    await axios.get('http://127.0.0.1:8000/topics/').then(res => {
      commit('SET_TOPICS', res.data)
    })
  }
}

export const getters = {
  token: state => {
    return state.token
  },
  auth: state => {
    return state.auth
  },
  topicsCount: state => {
    return state.topics.length
  },
  topics: state => {
    return state.topics
  },
  verifiedQuestions: state => {
    return state.verifiedQuestions
  },
  submitted: state => {
    return state.submitted
  }
}
