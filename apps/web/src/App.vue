<script setup lang="ts">
import type { UserHandler } from '@hippo/api'
import { hc } from 'hono/client'
import { onMounted } from 'vue'

const usersClient = hc<UserHandler>('http://localhost:3000/users')

onMounted(async () => {
  await usersClient.index.$get()
})
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
