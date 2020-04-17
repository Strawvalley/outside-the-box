import Vue from 'vue';
import { NotStarted, UserList, Thinking, Selecting, Guessing, RoundFinished, GameFinished, Timer } from './components';
import Pause from './components/pause.component.vue';

import { GameState } from '../shared';
import {
  setupAppListeners,
  initiateGame$,
  submitWordSelection$,
  unpauseGame$,
  pauseGame$,
  submitThinkingWord$,
  submitGuessingWord$,
  startNextRound$,
  createOrJoinGame$
} from './managers/client_game_manager';

import './app.css';

const app = new Vue({
  el: '#game',
  data: {
    socketId: "",
    game: {
      round: {}
    },
    gameInput: location.pathname.split('/')[1],
    usernameInput: sessionStorage.getItem('username')
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
    },
    getRoomFromPath(): boolean {
      return !!location.pathname.split('/')[1];
    }
  },
  methods: {
    createGame(): void {
      createOrJoinGame$.next({username: this.usernameInput, lang: "en"});
    },
    joinGame(): void {
      createOrJoinGame$.next({room: this.gameInput, username: this.usernameInput});
    },
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
      <div class="start-screen highlight" v-if="game.room === undefined">

        <div class="mb-1">Please enter your username:</div>
        <input class="mb-2" v-model="usernameInput" type="text" maxlength="12"/>
        <div class="mb-2">and</div>
        <div class="mb-2">
          <button class="large" v-on:click="createGame" v-if="!getRoomFromPath">Create Game</button>
        </div>
        <div class="mb-2">
          <span v-if="!getRoomFromPath">or</span>
          <input style="max-width: 150px;" v-model="gameInput"/>
          <button v-on:click="joinGame" ontouchstart="">Join Game</button>
        </div>

        <h3 class="highlight mb-2">How the game works:</h3>
        <p>One player is chosen to be the <span class="highlight">guesser</span> for the round.</p>
        <p>All other players are presented the word for this round and have to come up with a <span class="highlight">hint</span> for the guesser. The hint can only be a single word!</p>
        <p>As soon as all players have submitted their hints, the guesser has to <span class="highlight">find out the word</span> for this round.</p>
        <p>But there is a <span class="highlight">twist</span>! Hints have <span class="highlight">to be unique</span>, as soon as 2 or more players submit the same hint, it can not help the guesser to find the word! So <span class="highlight">think outside the box</span>, to make sure the guesser will find the word!</p>

      </div>
      <div v-if="game.room !== undefined">
        <button v-if="isAdmin && game.started" v-on:click="pauseGame">Pause game</button>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #004348; padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
          <div>
            <user-list v-bind:users="users" v-bind:admin="game.admin" v-bind:activePlayer="game.round.activePlayer"></user-list>
          </div>
          <div>
            <p class="stats"><b>Username</b> <span>{{game.username}}</span></p>
            <p class="stats"><b>Room</b> <span>{{game.room}}</span></p>
            <p class="stats"><b>Points</b> <span>{{ game.totalPoints }}</span></p>
            <p class="stats"><b>Round</b> <span>{{ game.currentRound }} / {{ game.totalRounds }}</span></p>
          </div>
        </div>
        <div style="position: relative;">
          <timer
            v-if="showTimer"
            v-bind:totalSeconds="game.round.totalSeconds" 
            v-bind:secondsLeft="game.round.secondsLeft"
            v-bind:paused="isPaused"
          ></timer>
        </div>

        <not-started
          v-if="isNotStarted"
          v-bind:isAdmin="isAdmin"
          v-bind:canBeStarted="hasMinRequiredUsers"
          v-on:startGame="startGame"
        ></not-started>
        
        <selecting
          v-if="isSelecting"
          v-bind:isActivePlayer="isActivePlayer"
          v-bind:activePlayer="game.round.activePlayer"
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
          v-bind:activePlayer="game.round.activePlayer"
          v-bind:userWords="game.round.filteredWordsInRound"
          v-on:submitGuess="submitGuess"
        ></guessing>

        <round-finished
          v-if="isRoundFinished"
          v-bind:isActivePlayer="isActivePlayer"
          v-bind:guesses="game.round.guesses"
          v-bind:userWords="game.round.wordsInRound"
          v-bind:wordToGuess="game.round.wordToGuess"
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

        <!--<div>Debug: {{JSON.stringify(game)}}</div>-->
      </div>
    </div>
  `
});

setupAppListeners(app);
