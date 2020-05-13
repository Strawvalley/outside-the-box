<template>
  <div>
    <div class="meta-container">
      <div style="display: flex;">
        <button class="mr-1" v-on:click="$emit('leaveGame')">{{ $t('gameButtonLeaveGame') }}</button>
        <button class="mr-1" v-if="isAdmin && game.started" v-on:click="pauseGame">{{ $t('gameButtonPauseGame') }}</button>
        <button v-on:click="toggleMute" :style="{ color: '#DDFDFF', 'margin-left': 'auto' }">
          <font-awesome-icon
            :icon="['fas', 'volume-up']"
            v-if="muted"
          ></font-awesome-icon>
          <font-awesome-icon
            v-if="!muted"
            :icon="['fas', 'volume-mute']"
          ></font-awesome-icon>
        </button>
      </div>
      <div
        style="display: flex; justify-content: space-between; padding-bottom: 0.75rem; margin-bottom: 0.75rem;"
      >
        <div>
          <user-list
            v-bind:users="users"
            v-bind:admin="game.admin"
            v-bind:username="game.username"
            v-bind:activePlayer="game.round.activePlayer"
          ></user-list>
        </div>
        <div>
          <p>
            <b style="font-size: 13px;">{{ $t('gameRoom') }}</b>
            <span class="highlight">{{game.room}}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="game-container">
      <game
        v-bind:game="game"
        v-bind:isAdmin="isAdmin"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:canBeStarted="hasMinRequiredUsers"
      ></game>
    </div>

    <pause
      v-if="isPaused"
      v-bind:isAdmin="isAdmin"
      v-bind:canBeStarted="hasMinRequiredUsers"
      v-on:continueGame="continueGame"
    ></pause>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import UserList from "./user-list.component.vue";
import Pause from "./pause.component.vue";
import Game from "./game.component.vue";

import { unpauseGame$, pauseGame$ } from "../managers/client_game_manager";
import { GameState } from "../../shared";
import audioManager, { muteState$ } from "../managers/audio_manager";

export default Vue.extend({
  props: ["socketId", "game", "muted"],
  components: {
    UserList,
    Pause,
    Game
  },
  computed: {
    isPaused(): boolean {
      return this.game.paused;
    },
    users(): { [key: string]: {} } {
      return this.game.users !== undefined ? this.game.users : {};
    },
    hasMinRequiredUsers(): boolean {
      if (this.game.users === undefined) return false;
      return (
        Object.values(this.game.users).filter(
          (u: { connected: boolean }) => u.connected
        ).length >= 3
      );
    },
    isAdmin(): boolean {
      return this.game.admin === this.socketId;
    },
    isActivePlayer(): boolean {
      return this.game.round.activePlayer === this.game.username;
    }
  },
  methods: {
    pauseGame(): void {
      pauseGame$.next();
    },
    continueGame(): void {
      unpauseGame$.next();
    },
    toggleMute(): void {
      muteState$.next(!this.muted);
    }
  }
});
</script>

<style>
.meta-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 800px;
  min-width: 400px;
  background-color: #DDFDFF;
  padding: 1rem;
  margin: 0.5rem;
}
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 800px;
  min-width: 400px;
  background-color: #DDFDFF;
  padding: 1rem;
  margin: 0.5rem;
}
</style>