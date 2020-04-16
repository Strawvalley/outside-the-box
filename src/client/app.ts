import Vue from 'vue';
import { NotStarted, UserList, Thinking, Selecting, Guessing, RoundFinished, GameFinished, Timer } from './components';
import Pause from './components/pause.component.vue';

import { GameState } from '../shared';
import { setupAppListeners, initiateGame$, submitWordSelection$, unpauseGame$, pauseGame$, submitThinkingWord$, submitGuessingWord$, startNextRound$ } from './managers/client_game_manager';

import './app.css';

const app = new Vue({
  el: '#game',
  data: {
    socketId: "",
    game: {
      round: {}
    },
  },
  components: {
    UserList,
    Timer,
    Pause,
    NotStarted,
    Selecting,
    Thinking,
    Guessing,
    RoundFinished,
    GameFinished,
  },
  computed: {
    isNotStarted(): boolean {
      return this.game.state === GameState.NOT_STARTED;
    },
    isPaused(): boolean {
      return this.game.paused;
    },
    isSelecting(): boolean {
      return this.game.state === GameState.SELECTING;
    },
    isThinking(): boolean {
      return this.game.state === GameState.THINKING;
    },
    isGuessing(): boolean {
      return this.game.state === GameState.GUESSING;
    },
    isRoundFinished(): boolean {
      return this.game.state === GameState.ROUND_FINISHED;
    },
    isGameFinished(): boolean {
      return this.game.state === GameState.GAME_FINISHED;
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
      return this.game.round.activePlayer === this.game.username;
    },
    showTimer(): boolean {
      if (this.game.round.totalSeconds === undefined) return false;
      return true;
    },
    hasSubmittedWord(): boolean {
      return this.game.round.usersSubmittedWordInRound.includes(this.game.username);
    }
  },
  methods: {
    startGame (): void {
      initiateGame$.next();
    },
    pauseGame (): void {
      pauseGame$.next();
    },
    continueGame (): void {
      unpauseGame$.next();
    },
    selectWord (wordIndex: string): void {
      submitWordSelection$.next(wordIndex);
    },
    submitThinkingWord(word: string): void {
      submitThinkingWord$.next(word);
    },
    submitGuess(guess: string): void {
      submitGuessingWord$.next(guess);
    },
    startNextRound(): void {
      startNextRound$.next();
    }
  },
  template:`
    <div>
      <h2>Room: {{game.room}}</h2>
      <h2>Username: {{game.username}}</h2>
      <button v-if="isAdmin && game.started" v-on:click="pauseGame">Pause game</button>
      <div>Points: {{ game.totalPoints }}</div>
      <div>Round: {{ game.currentRound }} / {{ game.totalRounds }}</div>
      <user-list v-bind:users="users" v-bind:admin="game.admin"></user-list>
      <timer v-if="showTimer" v-bind:totalSeconds="game.round.totalSeconds" v-bind:secondsLeft="game.round.secondsLeft"></timer>

      <not-started
        v-if="isNotStarted"
        v-bind:isAdmin="isAdmin"
        v-bind:canBeStarted="hasMinRequiredUsers"
        v-on:startGame="startGame"
      ></not-started>
      
      <selecting
        v-if="isSelecting"
        v-bind:isActivePlayer="isActivePlayer"
        v-on:selectWord="selectWord"
        v-bind:wordsForSelection="game.round.wordsForSelection"
      ></selecting>
      
      <thinking
        v-if="isThinking"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:wordToGuess="game.round.wordToGuess"
        v-bind:hasSubmittedWord="hasSubmittedWord"
        v-on:submitWord="submitThinkingWord"
      ></thinking>
      
      <guessing
        v-if="isGuessing"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:guessesLeft="game.round.guessesLeft"
        v-bind:guesses="game.round.guesses"
        v-bind:userWords="game.round.filteredWordsInRound"
        v-on:submitGuess="submitGuess"
      ></guessing>

      <round-finished
        v-if="isRoundFinished"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:guesses="game.round.guesses"
        v-bind:userWords="game.round.wordsInRound"
        v-bind:pointsInRound="game.round.pointsInRound"
        v-on:startNextRound="startNextRound"
      ></round-finished>

      <game-finished
        v-if="isGameFinished"
        v-bind:isAdmin="isAdmin"
        v-bind:totalPoints="game.totalPoints"
        v-bind:canBeStarted="hasMinRequiredUsers"
        v-on:startNewGame="startGame"
      ></game-finished>

      <pause v-if="isPaused" v-bind:isAdmin="isAdmin" v-bind:canBeStarted="hasMinRequiredUsers" v-on:continueGame="continueGame"></pause>

      <div>Debug: {{JSON.stringify(game)}}</div>
    </div>
  `
});

setupAppListeners(app);
