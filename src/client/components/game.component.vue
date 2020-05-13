<template>
  <div style="width: 100%;">
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
      <div class="stats">
        <b>{{ $t('gamePoints') }}</b><br>
        <span class="highlight">{{ game.totalPoints }}</span>
      </div>
      <div class="stats">
        <b>{{ $t('gameRound') }}</b><br>
        <span class="highlight">{{ game.currentRound }} / {{ game.totalRounds }}</span>
      </div>
      <timer
        v-bind:showTimer="showTimer"
        v-bind:totalSeconds="game.round.totalSeconds"
        v-bind:secondsLeft="game.round.secondsLeft"
        v-bind:paused="isPaused"
        v-bind:playSound="shouldPlayTimerSound"
      ></timer>
    </div>

    <wizard
      v-bind:state="game.state"
    ></wizard>

    <word
      v-if="showWord"
      v-bind:wordToGuess="game.round.wordToGuess"
    ></word>

    <div style="display: block">
      <not-started
        v-if="isNotStarted"
        v-bind:isAdmin="isAdmin"
        v-bind:canBeStarted="canBeStarted"
        v-bind:gameConfig="gameConfig"
        @updateGameConfig="gameConfig = $event"
      ></not-started>

      <selecting
        v-if="isSelecting"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:activePlayer="game.round.activePlayer"
        v-bind:wordsForSelection="game.round.wordsForSelection"
      ></selecting>

      <thinking
        v-if="isThinking"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:wordToGuess="game.round.wordToGuess"
        v-bind:usersSubmittedWordInRound="game.round.usersSubmittedWordInRound"
        v-bind:submittedWordByUser="game.round.submittedWordByUser"
        v-bind:username="game.username"
      ></thinking>

      <guessing
        v-if="isGuessing"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:guessesLeft="game.round.guessesLeft"
        v-bind:guesses="game.round.guesses"
        v-bind:activePlayer="game.round.activePlayer"
        v-bind:userWords="game.round.filteredWordsInRound"
        v-bind:wordToGuess="game.round.wordToGuess"
        v-bind:hint="game.round.hint"
        v-bind:isUserClose="game.round.isUserClose"
      ></guessing>

      <round-finished
        v-if="isRoundFinished"
        v-bind:isActivePlayer="isActivePlayer"
        v-bind:guesses="game.round.guesses"
        v-bind:userWords="game.round.wordsInRound"
        v-bind:wordToGuess="game.round.wordToGuess"
        v-bind:pointsInRound="game.round.pointsInRound"
        v-bind:isLastRound="isLastRound"
      ></round-finished>

      <game-finished
        v-if="isGameFinished"
        v-bind:isAdmin="isAdmin"
        v-bind:totalPoints="game.totalPoints"
        v-bind:canBeStarted="canBeStarted"
        v-bind:returnToMenu="returnToMenu"
      ></game-finished>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import NotStarted from "./game-states/not-started.component.vue";
import Selecting from "./game-states/selecting.component.vue";
import Thinking from "./game-states/thinking.component.vue";
import Guessing from "./game-states/guessing.component.vue";
import RoundFinished from "./game-states/round-finished.component.vue";
import GameFinished from "./game-states/game-finished.component.vue";
import Timer from "./timer.component.vue";
import Wizard from "./wizard.component.vue";
import Word from "./word.component.vue";


import { GameState, defaults, generateGameConfigDefaults } from "../../shared";

export default Vue.extend({
  props: ["game", "isAdmin", "canBeStarted"],
  components: {
    NotStarted,
    Selecting,
    Thinking,
    Guessing,
    RoundFinished,
    GameFinished,
    Timer,
    Wizard,
    Word
  },
  data: () => {
    return {
      gameConfig: generateGameConfigDefaults(),
    };
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
    isGuessing(): boolean {
      return this.game.state === GameState.GUESSING;
    },
    isRoundFinished(): boolean {
      return this.game.state === GameState.ROUND_FINISHED;
    },
    isGameFinished(): boolean {
      return this.game.state === GameState.GAME_FINISHED;
    },
    isActivePlayer(): boolean {
      return this.game.round.activePlayer === this.game.username;
    },
    isLastRound(): boolean {
      const usernames = Object.keys(this.game.users);
      const isLastPlayer = usernames.indexOf(this.game.round.activePlayer) === usernames.length - 1;
      return isLastPlayer && this.game.currentRound === this.game.totalRounds;
    },
    showTimer(): boolean {
      if (this.game.round.totalSeconds === undefined) return false;
      return true;
    },
    showWord(): boolean {
      return this.game.state !== GameState.GAME_FINISHED && this.game.state !== GameState.NOT_STARTED;;
    },
    shouldPlayTimerSound(): boolean {
      return this.game.state === GameState.THINKING || this.game.state === GameState.GUESSING;
    },
    isPaused(): boolean {
      return this.game.paused;
    },
  },
  methods: {
    returnToMenu(): void {
      this.game.state = GameState.NOT_STARTED;
    }
  }
})
</script>

<style>
.stats {
  text-align: center;
  margin-top: 10px;
}

.stats b {
  font-size: 13px;
  min-width: 90px;
  display: inline-block;
}

.stats span {
  min-width: 60px;
  font-size: 30px;
  display: inline-block;
}
</style>