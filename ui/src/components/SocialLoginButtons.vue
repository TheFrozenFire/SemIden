<template>
  <v-card
    class="mx-auto"
    tile
  >
    <v-list-item
      v-for="connection in displayedSocialConnections"
      v-bind:key="connection.name"
    >
      <v-btn v-on:click="$root.$emit('social-login', connection)">
        <v-img
          class="social-connection-logo"
          v-bind:src="connection.image"
          contain
        />
        {{ connection.title }}
      </v-btn>
    </v-list-item>
  </v-card>
</template>

<script>
  import '../styles/main.scss';
  
  import {
    connections as social_connections,
    supported_connections as supported_social_connections
  } from "../../auth0.config.js";
  
  export default {
    name: 'SocialLoginButtons',
    
    computed: {
      displayedSocialConnections() { return this.socialConnections.filter(connection => this.supportedSocialConnections.includes(connection.name)) }
    },

    data: () => ({
      supportedSocialConnections: supported_social_connections,
      socialConnections: social_connections
    }),
  }
</script>
