// Utility function for getting the authenticated user.

import axios from 'axios'

export default async store => {
  let error = false

  if (localStorage.getItem('needyourhelp_access') !== null) {
    store.commit('SET_TOKEN', localStorage.getItem('needyourhelp_access'))

    const client = axios.create({
      baseURL: 'http://127.0.0.1:8000/',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('needyourhelp_access')}`
      }
    })

    await client
      .get('auth/me/')
      .then(res => {
        store.commit('SET_AUTH', res.data)
      })
      .catch(() => {
        store.commit('SET_AUTH', {})
        error = true
      })
  }

  if (error) return false
}
