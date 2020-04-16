import Vue from 'vue';
import { NotStarted, UserList, Thinking, Selecting, Timer } from './components';
import { GameState } from '../shared';
import { setupApp, initiateGame$, submitWordSelection$ } from './managers/client_game_manager';

import './app.css';

const app = new Vue({
  el: '#game',
  data: {
    socketId: "",
    game: {},
    username: ""
  },
  components: {
    UserList,
    Timer,
    NotStarted,
    Selecting,
    Thinking,
  },
  computed: {
    isNotStarted(): boolean {
      return this.game.state === GameState.NOT_STARTED;
    },
    isSelecting(): boolean {
      return this.game.state === GameState.SELECTING;
    },
    isThinking(): boolean {
      return this.game.state === GameState.THINKING;
    },
    users(): { [key: string]: {} } {
      return this.game.users !== undefined ? this.game.users : {};
    },
    hasMinRequiredUsers(): boolean {
      if (this.game.users === undefined) return false;
      return Object.values(this.game.users).filter((u: { connected: boolean }) => u.connected).length >= 3;
    },
    isAdmin(): boolean {
      return this.game.admin === this.socketId;
    },
    isActivePlayer(): boolean {
      if (this.game.round === undefined) return false;
      return this.game.round.activePlayer === this.game.username;
    },
    getWordsForSelection(): string[] {
      if (this.game.round === undefined) return [];
      return this.game.round.wordsForSelection;
    },
    showTimer(): boolean {
      if (this.game.round === undefined) return false;
      if (this.game.round.totalSeconds === undefined) return false;
      return true;
    }
  },
  methods: {
    startGame (): void {
      initiateGame$.next();
    },
    selectWord (wordIndex: string): void {
      submitWordSelection$.next(wordIndex);
    }
  },
  template:`
    <div>
      <user-list v-bind:users="users"></user-list>
      <timer v-if="showTimer" v-bind:totalSeconds="game.round.totalSeconds" v-bind:secondsLeft="game.round.secondsLeft"></timer>

      <not-started v-if="isNotStarted" v-bind:isAdmin="isAdmin" v-bind:canBeStarted="hasMinRequiredUsers" v-on:startGame="startGame"></not-started>
      <selecting v-if="isSelecting" v-bind:isActivePlayer="isActivePlayer" v-on:selectWord="selectWord" v-bind:wordsForSelection="getWordsForSelection"></selecting>
      <thinking v-if="isThinking"></thinking>

      <div>Debug: {{JSON.stringify(game)}}</div>
    </div>
  `
});

setupApp(app);
