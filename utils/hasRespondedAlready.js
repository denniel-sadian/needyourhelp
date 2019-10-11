// Utility function for checking if interviewee has responded already.

import axios from 'axios'

export default async (fname, lname) => {
  let respondedAlready = false
  await axios
    .post(`http://127.0.0.1:8080/topics/${this.id}/responded/`, {
      firstname: fname,
      lastname: lname
    })
    .then(res => {
      if (res.data.responded) respondedAlready = true
    })
  return respondedAlready
}
