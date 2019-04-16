<template>
  <v-container>
    <v-list v-for="topic in $store.getters.topics" :key="topic.title">
      <v-list-tile>
        <v-list-tile-title>{{ topic.title }}</v-list-tile-title>
        <v-list-tile-content>
          {{ topic.description }}
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-container>
</template>

<script>
export default {}
</script>

<style scoped></style>
