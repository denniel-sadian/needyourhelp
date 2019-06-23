// Utility function for getting the authenticated user.

import axios from 'axios'

export default async store => {
  if (localStorage.getItem('needyourhelp_access') !== null) {
    store.commit('SET_TOKEN', localStorage.getItem('needyourhelp_access'))
    store.commit('SET_EXPIRED', false)

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
        localStorage.removeItem('needyourhelp_access')
        store.commit('SET_AUTH', {})
        store.commit('SET_EXPIRED', true)
      })
  }
}
