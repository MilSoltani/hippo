<script setup lang="ts">
import { useGetTickets } from './client/generated/ticket/ticket'

const { data, isLoading, error } = useGetTickets()
</script>

<template>
  <div>
    <h1>Tickets</h1>

    <div v-if="isLoading" class="loading">
      Loading tickets...
    </div>

    <div v-else-if="error" class="error">
      Error loading tickets: {{ error }}
    </div>

    <div v-else-if="data?.data">
      <ul>
        <li v-for="ticket in data?.data" :key="ticket.id">
          <strong>{{ ticket.subject }}</strong> - {{ ticket.description }}
        </li>
      </ul>
    </div>

    <div v-else>
      No tickets found.
    </div>
  </div>
</template>

<style scoped>
</style>
