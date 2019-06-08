<template>
  <v-container grid-list-xs text-xs-center my-5>
    <img src="/images/heart.png" style="width: auto; height: 200px" />
    <h1 class="display-4 font-weight-black hidden-xs-only hidden-sm-only">
      Thank you for responding!
    </h1>
    <h1 class="display-2 font-weight-black hidden-md-and-up">
      Thank you for responding!
    </h1>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: 'Thank You! <3',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Thank you for responding!'
        },
        {
          hid: 'twitter-title',
          name: 'twitter:title',
          content: 'Thank You! <3'
        },
        {
          hid: 'twitter-desc',
          name: 'twitter:description',
          content: 'Thank you for responding!'
        },
        {
          hid: 'twitter-preview_img',
          name: 'twitter:image',
          content: 'https://needyourhelp.herokuapp.com/images/hands.png'
        },
        {
          hid: 'preview_img',
          property: 'og:image',
          content: 'https://needyourhelp.herokuapp.com/images/hands.png'
        }
      ]
    }
  }
}
</script>
