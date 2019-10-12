// For determining whether respondents can still view the respond page.

import axios from 'axios'

export default async function({ route, redirect }) {
  await axios
    .get(`https://needyourhelp-api.herokuapp.com/topics/${route.params.id}/`)
    .then(res => {
      if (res.data.done) redirect({ name: 'topics' })
      else if (route.query.fname & route.query.lname)
        redirect({ name: 'respond', params: route.params, query: route.query })
    })
}
