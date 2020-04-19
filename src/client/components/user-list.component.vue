<template>
  <div>
    <p class="stats" style="text-align: left;">
      <b style="text-align: left;">{{ $t('userlistTitle') }}</b>
    </p>
    <ul style="list-style: none;">
      <li
        v-for="user in Object.keys(users)"
        class="highlight"
        v-bind:key="user"
      >{{ user === activePlayer ? '-->' : '' }} {{ user }} {{ users[user].connected ? '' : $t('userlistDisconnected') }} {{users[user].socketId === admin ? $t('userlistAdmin') : ""}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["users", "admin", "activePlayer"]
});
</script>