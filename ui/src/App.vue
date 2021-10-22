<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        SemIden
      </div>

    </v-app-bar>

    <v-main>
      <SocialLoginButtons />
      
      <v-dialog v-model="show_insert_identity">
        <JWT v-bind:jwt="jwt" />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { client as auth0_config } from "../auth0.config.js";
import createAuth0Client from '@auth0/auth0-spa-js';

import SocialLoginButtons from './components/SocialLoginButtons';
import JWT from './components/JWT';

export default {
  name: 'App',

  components: {
    SocialLoginButtons,
    JWT,
  },
  
  data: () => ({
    show_insert_identity: false,
    jwt: null
  }),
  
  mounted: async function() {
    const auth0 = await createAuth0Client(auth0_config)
    
    this.$root.$on('social-login', async function(connection) {
      await auth0.loginWithPopup({connection: connection.name});
      
      const claims = await auth0.getIdTokenClaims();
      const {header, payload, signature} = claims._raw.split('.');
      
      this.jwt = {
        header: Buffer.from(header, 'base64').toString(),
        payload: Buffer.from(payload, 'base64').toString(),
        signature: "0x" + Buffer.from(signature, 'base64').toString('hex'),
        claims: claims,
      };
      this.show_insert_identity = true;
    });
  }
};
</script>
