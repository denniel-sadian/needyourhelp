<template>
  <v-app dark>
    <v-toolbar id="nav" app flat>
      <v-toolbar-title
        ><v-icon>favorite</v-icon> Need Your Help</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn round flat>Topics</v-btn>
        <v-btn round flat>About</v-btn>
        <v-btn round flat>Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container id="header" fluid pt-5>
      <v-layout
        row
        align-center
        justify-center
        wrap
        hidden-xs-only
        hidden-sm-only
      >
        <v-flex md4 pr-5>
          <img
            id="logo"
            src="~/assets/images/logo.png"
            width="250"
            height="auto"
            style="float: right; border: 5px solid white; border-radius: 100%"
          />
        </v-flex>
        <v-flex md6>
          <h1 class="display-4 font-weight-black">
            Need
            <span class="font-italic">Your</span> Help
          </h1>
        </v-flex>
        <v-flex md12 text-xs-center mt-5>
          <v-btn large round class="purple">Get Started</v-btn>
        </v-flex>
      </v-layout>
      <v-layout
        row
        align-center
        justify-center
        wrap
        hidden-xs-only
        hidden-md-and-up
      >
        <v-flex sm5 pr-4>
          <img
            id="logo"
            src="~/assets/images/logo.png"
            width="180"
            height="auto"
            style="float: right; border: 5px solid white; border-radius: 100%"
          />
        </v-flex>
        <v-flex sm7>
          <h1 class="display-3 font-weight-black">
            Need
            <span class="font-italic">Your</span> Help
          </h1>
        </v-flex>
        <v-flex sm12 text-xs-center mt-5>
          <v-btn large round class="purple">Get Started</v-btn>
        </v-flex>
      </v-layout>
      <v-layout column text-xs-center wrap hidden-sm-and-up>
        <v-flex>
          <img
            src="~/assets/images/logo.png"
            width="180"
            height="auto"
            style="border: 5px solid white; border-radius: 100%"
          />
        </v-flex>
        <v-flex>
          <h1 class="display-3 font-weight-black">Need Your Help</h1>
        </v-flex>
        <v-flex text-xs-center mt-3>
          <v-btn large round class="purple">Get Started</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container mt-4>
      <v-layout row wrap>
        <v-flex v-for="desc in descs" :key="desc.title" md4 pa-2>
          <v-card>
            <v-img :src="desc.image" aspect-ratio="2"></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-1">{{ desc.title }}</h3>
                <div>{{ desc.content }}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      descs: [
        {
          title: 'What is this website?',
          content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas,
                  alias aspernatur. Obcaecati officiis, cum numquam quos beatae
                  natus vero, distinctio dolore aliquid perspiciatis, libero
                  veritatis cumque nisi dolorem dolores incidunt?`,
          image: '/images/questions.png'
        },
        {
          title: 'Introduces paper-less survey',
          content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas,
                  alias aspernatur. Obcaecati officiis, cum numquam quos beatae
                  natus vero, distinctio dolore aliquid perspiciatis, libero
                  veritatis cumque nisi dolorem dolores incidunt?`,
          image: '/images/paper-less.jpg'
        },
        {
          title: 'Survey on the cloud',
          content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas,
                  alias aspernatur. Obcaecati officiis, cum numquam quos beatae
                  natus vero, distinctio dolore aliquid perspiciatis, libero
                  veritatis cumque nisi dolorem dolores incidunt?`,
          image: '/images/clouds.png'
        }
      ]
    }
  }
}
</script>

<style scoped>
#header,
#nav {
  background: url('../assets/images/header.jpg') !important;
  background-attachment: fixed !important;
  background-size: cover !important;
  background-position: center !important;
}
#header {
  margin-top: 40px;
}
</style>
