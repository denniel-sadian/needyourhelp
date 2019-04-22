// For determining whether there's a logged in user.

export default function({ store, redirect }) {
  if (!store.getters.auth.username) redirect('/topics')
}
