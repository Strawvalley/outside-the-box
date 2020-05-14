<template>
  <div>
    <div class="meta-container">
      <div style="display: flex;">
        <button class="mr-1" v-on:click="$emit('leaveGame')">{{ $t('gameButtonLeaveGame') }}</button>
        <button class="mr-1" v-if="isAdmin && game.started" v-on:click="pauseGame">{{ $t('gameButtonPauseGame') }}</button>
        <button v-on:click="toggleMute" :style="{ color: '#DDFDFF', 'margin-left': 'auto' }">
          <font-awesome-icon
            :icon="['fas', 'volume-up']"
            v-if="!muted"
          ></font-awesome-icon>
          <font-awesome-icon
            v-if="muted"
            :icon="['fas', 'volume-mute']"
          ></font-awesome-icon>
        </button>
      </div>
      <div
        style="display: flex; justify-content: space-between;"
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
          <b style="font-size: 13px; margin-bottom: 0.25rem; text-align: center; display: block;">{{ $t('gameRoom') }}</b>
          <p class="highlight" style="margin-bottom: 0.25rem;">{{game.room}}</p>
          <button class="small" v-on:click="inviteOthers">Invite others</button>
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
import VueToast from 'vue-toast-notification';

import UserList from "./user-list.component.vue";
import Pause from "./pause.component.vue";
import Game from "./game.component.vue";

import { unpauseGame$, pauseGame$ } from "../managers/client_game_manager";
import { GameState } from "../../shared";
import audioManager, { muteState$ } from "../managers/audio_manager";

import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast);

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
    },
    inviteOthers(): void {
      const dummyInput = document.createElement('input'), text = window.location.href;

      document.body.appendChild(dummyInput);
      dummyInput.value = text;
      dummyInput.select();
      document.execCommand('copy');
      document.body.removeChild(dummyInput);

      (Vue as any).$toast.open({
        message: this.$t('invitationLinkCopied'),
        type: 'success',
        position: 'top-right',
        duration: 1500,
      });
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
  min-width: 350px;
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
  min-width: 350px;
  background-color: #DDFDFF;
  padding: 1rem;
  margin: 0.5rem;
}
.notices {
  top: 5px;
  right: 5px;
}
.notices .toast {
  min-height: 2rem;
  margin: 0.25rem 0rem;
}
.notices .toast-success {
  background-color: #068890;
}
.notices .toast .toast-text {
  padding: 0.5rem 0.5rem;
}
.notices .toast .toast-icon {
  margin-left: 0.5rem;
}
</style>