// For determining whether respondents can still view the respond page.

import axios from 'axios'

export default async function({ route, redirect }) {
  await axios
    .get(`https://needyourhelp-api.herokuapp.com/topics/${route.params.id}/`)
    .then(res => {
      if (res.data.done) redirect('/topics')
    })
}
