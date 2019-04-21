export default function({ store, redirect }) {
  if (!store.getters.auth.username) redirect('/topics')
}
