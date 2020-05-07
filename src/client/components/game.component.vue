<template>
  <div>
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
</template>

<script lang="ts">
import Vue from 'vue'

import NotStarted from "./game-states/not-started.component.vue";
import Selecting from "./game-states/selecting.component.vue";
import Thinking from "./game-states/thinking.component.vue";
import Guessing from "./game-states/guessing.component.vue";
import RoundFinished from "./game-states/round-finished.component.vue";
import GameFinished from "./game-states/game-finished.component.vue";

import { GameState, defaults, generateGameConfigDefaults } from "../../shared";

export default Vue.extend({
  props: ["game", "isAdmin", "canBeStarted"],
  components: {
    NotStarted,
    Selecting,
    Thinking,
    Guessing,
    RoundFinished,
    GameFinished
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
    }
  },
  methods: {
    returnToMenu(): void {
      this.game.state = GameState.NOT_STARTED;
    }
  }
})
</script>