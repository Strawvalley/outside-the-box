<template>
  <div>
    <div v-if="game.room">
      <room
        v-bind:socketId="socketId"
        v-bind:game="game"
      ></room>
    </div>
    <div v-else>
      <start></start>
    </div>
    <debug
      v-if="false"
      v-bind:game="game"
    ></debug>
  </div>
</template>


<script lang="ts">
import Vue from "vue";

import Start from "./components/start.component.vue";
import Room from "./components/room.component.vue";
import Debug from "./components/debug.component.vue";

import { gameState$ } from "./managers/client_game_manager";
import { setupAppListeners } from "./managers/client_game_manager";

import "./app.css";
import audioManager from "./managers/audio_manager";

export default Vue.extend({
  data() {
    return {
      socketId: "",
      game: {}
    };
  },
  components: {
    Start,
    Room,
    Debug
  },
  created: function() {
    setupAppListeners();
    gameState$.subscribe(({ socketId, game }) => {
      this.socketId = socketId;
      this.game = game;
      audioManager.playSoundByUpdateTrigger(game.updateTrigger);
    });
  }
});
</script>

