// For getting the topic.

export default async function({ store }) {
  await store.dispatch('getTopics')
}
