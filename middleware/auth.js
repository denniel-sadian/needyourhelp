// For getting the authenticated user.

import getAuth from '~/utils/getAuth.js'

export default async function({ store }) {
  if (process.client) await getAuth(store)
}
