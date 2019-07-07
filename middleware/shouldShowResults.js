// For determining whether to show the results if the
// topic is done or the owner is the logged in user.

import axios from 'axios'

export default async function({ store, route, redirect }) {
  const config = {
    baseURL: 'https://needyourhelp-api.herokuapp.com/'
  }
  if (store.getters.token) {
    config.headers = {
      Authorization: `Bearer ${store.getters.token}`
    }
  }
  const client = axios.create(config)
  await client
    .get(`topics/${route.params.id}/`)
    .then(res => {
      const topic = res.data
      if (topic.done) return true
      if (store.getters.auth.username) {
        if (store.getters.auth.username !== topic.owner) redirect('/topics')
      } else if (!topic.done) redirect('/topics')
    })
    .catch(() => redirect('/topics'))
}
