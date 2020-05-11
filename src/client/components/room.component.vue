<template>
  <div>
    <div style="display: flex;">
      <button v-on:click="$emit('leaveGame')">{{ $t('gameButtonLeaveGame') }}</button>
      <button v-if="isAdmin && game.started" v-on:click="pauseGame">{{ $t('gameButtonPauseGame') }}</button>
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
      style="display: flex; justify-content: space-between; border-bottom: 1px dashed #004348; padding-bottom: 0.75rem; margin-bottom: 0.75rem;"
    >
      <div>
        <user-list
          v-bind:users="users"
          v-bind:admin="game.admin"
          v-bind:activePlayer="game.round.activePlayer"
        ></user-list>
      </div>
      <div>
        <p class="stats">
          <b>{{ $t('gameUsername') }}</b>
          <span>{{game.username}}</span>
        </p>
        <p class="stats">
          <b>{{ $t('gameRoom') }}</b>
          <span>{{game.room}}</span>
        </p>
        <p class="stats">
          <b>{{ $t('gamePoints') }}</b>
          <span>{{ game.totalPoints }}</span>
        </p>
        <p class="stats">
          <b>{{ $t('gameRound') }}</b>
          <span>{{ game.currentRound }} / {{ game.totalRounds }}</span>
        </p>
      </div>
    </div>
    <div style="position: relative;">
      <timer
        v-if="showTimer"
        v-bind:totalSeconds="game.round.totalSeconds"
        v-bind:secondsLeft="game.round.secondsLeft"
        v-bind:paused="isPaused"
        v-bind:playSound="shouldPlayTimerSound"
      ></timer>
    </div>

    <game
      v-bind:game="game"
      v-bind:isAdmin="isAdmin"
      v-bind:isActivePlayer="isActivePlayer"
      v-bind:canBeStarted="hasMinRequiredUsers"
    ></game>

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
import Timer from "./timer.component.vue";
import Pause from "./pause.component.vue";
import Game from "./game.component.vue";

import { unpauseGame$, pauseGame$ } from "../managers/client_game_manager";
import { GameState } from "../../shared";
import audioManager, { muteState$ } from "../managers/audio_manager";

export default Vue.extend({
  props: ["socketId", "game", "muted"],
  components: {
    UserList,
    Timer,
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
    },
    showTimer(): boolean {
      if (this.game.round.totalSeconds === undefined) return false;
      return true;
    },
    shouldPlayTimerSound(): boolean {
      return this.game.state === GameState.THINKING || this.game.state === GameState.GUESSING;
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
