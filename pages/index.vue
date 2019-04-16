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
                <div>{{ desc.content }}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
      <v-divider />
    </v-container>

    <v-container grid-list-sm mb-5>
      <v-layout row wrap>
        <v-flex d-flex xs12 text-xs-center>
          <h1 class="display-3">How to use?</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <v-layout row wrap>
            <v-flex d-flex sm4 xs12>
              <v-card>
                <v-card-text class="display-4 text-xs-center"
                  >1<sup>st</sup></v-card-text
                >
              </v-card>
            </v-flex>
            <v-flex d-flex sm8 xs12>
              <v-card>
                <v-card-text class="headline">
                  If you have a topic that you wish to conduct a survey with,
                  then you must first create an account. With that, your
                  respondents will be able to know who is the owner of the
                  topic.
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 mt-4>
          <v-layout row wrap>
            <v-flex d-flex sm8 xs12 order-xs2 order-sm1>
              <v-card>
                <v-card-text class="headline">
                  You begin creating your topics. Also This website allows you
                  to dynamically create question sheets that contain the
                  questions that your topics need. It provides you two types of
                  questions: a text-answered question and a multiple choice
                  question.
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex sm4 xs12 order-xs1 order-sm2>
              <v-card>
                <v-card-text class="display-4 text-xs-center"
                  >2<sup>nd</sup></v-card-text
                >
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 mt-4>
          <v-layout row wrap>
            <v-flex d-flex sm4 xs12>
              <v-card>
                <v-card-text class="display-4 text-xs-center"
                  >3<sup>rd</sup></v-card-text
                >
              </v-card>
            </v-flex>
            <v-flex d-flex sm8 xs12>
              <v-card>
                <v-card-text class="headline">
                  You share the link of your topics to anyone - your
                  respondents. You can post the link as well to any social media
                  platform to boost the coverage of the survey. You can always
                  take a peek of the automatically calculated results of your
                  topics.
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
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
        <v-icon>check_circle</v-icon>
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
      if (this.$store.getters.token.refresh) {
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
