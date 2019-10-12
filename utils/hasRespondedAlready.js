// Utility function for checking if interviewee has responded already.

import axios from 'axios'

export default async (id, fname, lname) => {
  let respondedAlready = false
  if (fname && lname) {
    await axios
      .post(`https://needyourhelp-api.herokuapp.com/topics/${id}/responded/`, {
        firstname: fname,
        lastname: lname
      })
      .then(res => {
        if (res.data.responded) respondedAlready = true
      })
  }
  return respondedAlready
}
