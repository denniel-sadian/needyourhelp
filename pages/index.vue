<template>
  <div>
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
          <v-btn large round class="purple" @click="getStarted()"
            >Get Started</v-btn
          >
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
          <v-btn large round class="purple" @click="getStarted()"
            >Get Started</v-btn
          >
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
          <v-btn large round class="purple" @click="getStarted()"
            >Get Started</v-btn
          >
        </v-flex>
      </v-layout>
    </v-container>

    <v-container mt-4 text-xs-center>
      <v-layout justify-center row wrap mb-5>
        <v-flex v-for="desc in descs" :key="desc.title" d-flex item sm4 pa-2>
          <v-card class="round">
            <v-img :src="desc.image" aspect-ratio="2"></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-1">{{ desc.title }}</h3>
                <div class="body-2">
                  {{ desc.content }}
                </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
      <v-divider />
    </v-container>

    <v-container grid-list-xs mb-5>
      <div class="text-xs-center display-1">How to use?</div>
      <v-layout row align-center justify-center wrap text-xs-center pt-5>
        <v-flex xs12 sm4 display-4>1<sup>st</sup> </v-flex>
        <v-flex xs12 sm8 subheading text-md-left>
          If you have a topic that you wish to conduct a survey with. You can
          create it here. First, you create your account, and all the topics you
          create will reference to you. Creating you account is very easy, try
          to create one now!
        </v-flex>
      </v-layout>
      <v-layout row align-center justify-center wrap text-xs-center pt-5>
        <v-flex xs12 sm4 order-sm2 display-4>2<sup>nd</sup> </v-flex>
        <v-flex xs12 sm8 subheading text-md-right>
          Great! Now you have your account, it's now time to create topics!
          Creating topics is just a piece of cake. You just have to head over to
          the
          <nuxt-link to="/topics" class="subheading yellow--text"
            >Topics</nuxt-link
          >
          page. This website lets you build a questionaire that has two kinds of
          questions. One that can be answered by pure opinions of the
          respondents, good for qualitative research. And the other one that has
          multiple choices, which is good for quantitative research.
        </v-flex>
      </v-layout>
      <v-layout row align-center justify-center wrap text-xs-center pt-5>
        <v-flex xs12 sm4 display-4>3<sup>rd </sup> </v-flex>
        <v-flex xs12 sm8 subheading text-md-left>
          Now, you're done with the creation of your topic. You can now share
          the link of your topic to your respondents. Sharing the link to social
          platforms you like will do very well as well. The results of your
          topic will only be visible to you, but if you mark your topic as done,
          anyone will be able to see the results. All of the calculations will
          be done for you.
        </v-flex>
      </v-layout>
    </v-container>

    <v-snackbar
      v-model="getSartedSnack"
      :timeout="5000"
      color="blue"
      top
      multi-line
      class="subheading"
    >
      You're not yet logged in. You can register if you don't have your account
      yet.
      <v-btn fab flat @click="getSartedSnack = false">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getSartedSnack: false,
      descs: [
        {
          title: 'What is this website?',
          content: `This website is an online platform where electronic surveys
          take place. Just sign-up, create topics, share your topics' links to
          your respondents, and let them interact with the questions that you can
          dynamically create. `,
          image: '/images/questions.png'
        },
        {
          title: 'Introduces paper-less survey',
          content: `Since this is a "website", you don't have to print a lot of
          questionaires that you give to your respondents. Most of the people
          nowadays have their own mobile phones, they can answer the survey there.
          This also promotes a green concept, let us save the trees!`,
          image: '/images/paper-less.jpg'
        },
        {
          title: 'Survey on the cloud',
          content: `The results of your topics' surveys will be stored on the cloud,
          this website keeps it there for you. The results, as well, is taken
          care for you. Do you have those multiple choice questions? You count
          the votes manually which is a bit frustrating. This website takes care
          of that for you, too!`,
          image: '/images/clouds.png'
        }
      ]
    }
  },
  methods: {
    getStarted() {
      if (this.$store.getters.auth.username) {
        this.$router.push('topics')
      } else {
        this.getSartedSnack = true
      }
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
.round {
  border-radius: 10px;
}
</style>
