import getAuth from '~/utils/getAuth.js'

export default async function(context) {
  context.store.dispatch('getTopics')
  if (process.client) await getAuth(context.store)
}
