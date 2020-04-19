<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import UserList from "./user-list.component.vue";
import Timer from "./timer.component.vue";
import Pause from "./pause.component.vue";

import NotStarted from "./game-states/not-started.component.vue";
import Selecting from "./game-states/selecting.component.vue";
import Thinking from "./game-states/thinking.component.vue";
import Guessing from "./game-states/guessing.component.vue";
import RoundFinished from "./game-states/round-finished.component.vue";
import GameFinished from "./game-states/game-finished.component.vue";

import {
  initiateGame$,
  submitWordSelection$,
  unpauseGame$,
  pauseGame$,
  submitThinkingWord$,
  submitGuessingWord$,
  startNextRound$,
  gameState$
} from "../managers/client_game_manager";

import { GameState } from "../../shared";

export default Vue.extend({
  props: ["socketId", "game"],
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
    }
  },
  methods: {
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
    }
  }
});
</script>
