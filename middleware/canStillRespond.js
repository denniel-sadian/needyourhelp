// For determining whether respondents can still view the respond page.

import axios from 'axios'

export default async function({ route, redirect }) {
  await axios
    .get(`http://127.0.0.1:8000/topics/${route.params.id}/`)
    .then(res => {
      if (res.data.done) redirect('/topics')
    })
}
