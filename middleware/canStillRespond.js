// For determining whether respondents can still view the respond page.

import axios from 'axios'

import hasRespondedAlready from '~/utils/hasRespondedAlready.js'

export default async function({ route, redirect }) {
  await axios
    .get(`http://127.0.0.1:8080/topics/${route.params.id}/`)
    .then(async res => {
      if (res.data.done) return redirect({ name: 'topics' })
      else if (route.query.fname & route.query.lname)
        if (
          await hasRespondedAlready(
            route.params.id,
            route.query.fname,
            route.lname
          )
        ) {
          return redirect({ name: 'topics' })
        }
      return redirect({
        name: 'respond',
        params: route.params,
        query: route.query
      })
    })
}
