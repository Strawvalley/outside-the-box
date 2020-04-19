<template>
  <div>
    <div class="start-screen highlight" v-if="game.room === undefined">
      <div class="select-wrapper">
        <select v-model="selectedLocale" @change="changeLocale">
          <option
            v-for="option in locales"
            v-bind:value="option.locale"
            v-bind:key="option.locale"
          >{{ option.title }}</option>
        </select>
      </div>

      <div class="mb-1">{{ $t('roomEnterUsername') }}</div>
      <input
        class="mb-2"
        v-model="usernameInput"
        type="text"
        maxlength="12"
        v-on:keyup.enter="onEnterKeyUp"
        autofocus
      />
      <div class="mb-2">{{ $t('roomAnd') }}</div>
      <div class="mb-2">
        <button
          class="large"
          v-on:click="createGame"
          v-if="!hasRoomInPath"
        >{{ $t('roomButtonCreateGame') }}</button>
      </div>
      <div class="mb-2">
        <span v-if="!hasRoomInPath">{{ $t('roomOr') }}</span>
        <input style="max-width: 115px;" v-model="gameInput" :disabled="hasRoomInPath"/>
        <button v-on:click="joinGame" ontouchstart>{{ $t('roomButtonJoinGame') }}</button>
      </div>

      <h3 class="highlight mb-2">{{ $t('roomInstructionTitle') }}</h3>
      <p>
        <i18n path="roomInstructionParagraph1">
          <span class="highlight">{{ $t('roomInstructionParagraph1Guesser') }}</span>
        </i18n>
      </p>
      <p>
        <i18n path="roomInstructionParagraph2">
          <span class="highlight">{{ $t('roomInstructionParagraph2Hint') }}</span>
        </i18n>
      </p>
      <p>
        <i18n path="roomInstructionParagraph3">
          <span class="highlight">{{ $t('roomInstructionParagraph3FigureWord') }}</span>
        </i18n>
      </p>
      <p>
        <i18n path="roomInstructionParagraph4">
          <span class="highlight">{{ $t('roomInstructionParagraph4Twist') }}</span>
          <span class="highlight">{{ $t('roomInstructionParagraph4Unique') }}</span>
          <span class="highlight">{{ $t('roomInstructionParagraph4OutsideTheBox') }}</span>
        </i18n>
      </p>
    </div>
    <div v-if="game.room !== undefined">
      <button v-if="isAdmin && game.started" v-on:click="pauseGame">{{ $t('gameButtonPauseGame') }}</button>
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

      <pause
        v-if="isPaused"
        v-bind:isAdmin="isAdmin"
        v-bind:canBeStarted="hasMinRequiredUsers"
        v-on:continueGame="continueGame"
      ></pause>

      <!--<div>Debug: {{JSON.stringify(game)}}</div>-->
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";

import i18n from "./plugins/i18n";

import UserList from "./components/user-list.component.vue";
import Timer from "./components/timer.component.vue";
import Pause from "./components/pause.component.vue";
import NotStarted from "./components/game-states/not-started.component.vue";
import Selecting from "./components/game-states/selecting.component.vue";
import Thinking from "./components/game-states/thinking.component.vue";
import Guessing from "./components/game-states/guessing.component.vue";
import RoundFinished from "./components/game-states/round-finished.component.vue";
import GameFinished from "./components/game-states/game-finished.component.vue";

import { GameState } from "../shared";
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
} from "./managers/client_game_manager";

import "./app.css";

export default Vue.extend({
  data() {
    return {
      socketId: "",
      game: {
        round: {}
      },
      gameInput: location.pathname.split("/")[1],
      usernameInput: sessionStorage.getItem("username"),
      locales: [
        { locale: "en", title: "English" },
        { locale: "de", title: "Deutsch" }
      ],
      selectedLocale: i18n.locale
    };
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
    GameFinished
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
    hasSubmittedWord(): boolean {
      return this.game.round.usersSubmittedWordInRound.includes(
        this.game.username
      );
    },
    hasRoomInPath(): boolean {
      return !!location.pathname.split("/")[1];
    }
  },
  methods: {
    onEnterKeyUp(): void {
      this.hasRoomInPath ? this.createGame() : this.joinGame()
    },
    createGame(): void {
      createOrJoinGame$.next({
        username: this.usernameInput,
        lang: i18n.locale
      });
    },
    joinGame(): void {
      createOrJoinGame$.next({
        room: this.gameInput,
        username: this.usernameInput
      });
    },
    startGame(): void {
      initiateGame$.next();
    },
    pauseGame(): void {
      pauseGame$.next();
    },
    continueGame(): void {
      unpauseGame$.next();
    },
    selectWord(wordIndex: string): void {
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
    },
    changeLocale(event): void {
      i18n.locale = event.target.value;
      localStorage.setItem("locale", event.target.value);
    }
  },
  created: function() {
    setupAppListeners(this);
  }
});
</script>

