<template>
  <div>
    <p class="stats" style="text-align: left;">
      <b style="text-align: left;">{{ $t('userlistTitle') }}</b>
    </p>
    <ul style="list-style: none;">
      <li
        v-for="(user, index) in Object.keys(users)"
        class="highlight"
        v-bind:key="index"
        v-bind:class="{ 'disconnected': !users[user].connected }"
      >
        <font-awesome-icon
          v-if="user === activePlayer"
          :icon="['fas', 'angle-right']"
          v-bind:title="$t('userlistActivePlayer')"
        ></font-awesome-icon>
        {{ user }} {{ user === username ? $t('userListYou') : '' }}
        <font-awesome-icon
          v-if="!users[user].connected"
          :icon="['fas', 'user-alt-slash']"
          v-bind:title="$t('userlistDisconnected')"
        ></font-awesome-icon>
        <font-awesome-icon
          v-if="users[user].socketId === admin"
          :icon="['fas', 'crown']"
          v-bind:title="$t('userlistAdmin')"
        ></font-awesome-icon>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["users", "admin", "activePlayer", "username"]
});
</script>