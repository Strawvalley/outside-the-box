import Vue from 'vue';
import { NotStarted, UserList, Thinking, Selecting } from './components';
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
    NotStarted,
    Selecting,
    Thinking
  },
  computed: {
    isNotStarted: function(): boolean {
      return this.game.state === GameState.NOT_STARTED;
    },
    isSelecting: function(): boolean {
      return this.game.state === GameState.SELECTING;
    },
    isThinking: function(): boolean {
      return this.game.state === GameState.THINKING;
    },
    users: function(): { [key: string]: {} } {
      return this.game.users !== undefined ? this.game.users : {};
    },
    hasMinRequiredUsers: function(): boolean {
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

      <not-started v-if="isNotStarted" v-bind:isAdmin="isAdmin" v-bind:canBeStarted="hasMinRequiredUsers" v-on:startGame="startGame"></not-started>
      <selecting v-if="isSelecting" v-bind:isActivePlayer="isActivePlayer" v-on:selectWord="selectWord" v-bind:wordsForSelection="getWordsForSelection"></selecting>
      <thinking v-if="isThinking"></thinking>

      <div>Debug: {{JSON.stringify(game)}}</div>
    </div>
  `
});

setupApp(app);
