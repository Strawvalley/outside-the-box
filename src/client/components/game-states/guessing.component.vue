<template>
  <div style="display: flex; flex-direction: column; text-align: center;">

    <!--<div class="mb-2" v-if="!isActivePlayer">
      {{ $t('guessingHintText2') }}
      <span class="highlight">{{wordToGuess}}</span>
    </div>-->
    <div class="mb-2" v-if="!isActivePlayer">
      <span class="highlight">{{activePlayer}}</span> {{ $t('guessingHintText1') }}
    </div>
    <div class="mb-1 highlight">{{ $t('guessingHintsTitle') }}</div>
    <ul class="mb-2">
      <li
        class="highlight"
        v-for="(entry, index) in userWords"
        v-bind:key="index"
      >{{ entry.word === undefined ? entry.users.join(", ") + $t('guessingHintsSameWord') : entry.word }}</li>
    </ul>

    <div class="mb-2">
      <div v-if="isActivePlayer">
        {{ $t('guessingYouHave') }}
        <span class="highlight">{{guessesLeft}}</span>
        {{ $t('guessingGuessesLeft') }}
      </div>
      <div v-else>
        <span class="highlight">{{activePlayer}}</span>
        {{ $t('guessingHas') }}
        <span class="highlight">{{guessesLeft}}</span>
        {{ $t('guessingGuessesLeft') }}
      </div>
    </div>
    
    <div v-if="hint" class="mb-2">
      <span class="highlight hint">{{hint}}</span>
    </div>

    <div v-if="isUserClose" class="mb-2">
      <div v-if="isActivePlayer">
        <span class="close">{{ $t('guessingCloseToSolution1') }}</span>
      </div>
      <div v-else>
        <span class="highlight close">{{activePlayer}}</span>
        <span class="close">{{ $t('guessingCloseToSolution2') }}</span>
      </div>
    </div>

    <div v-if="isActivePlayer">
      <p class="error" v-if="hasError">{{errorMessage}}</p>
      <input
        id="guess-input"
        class="mb-2"
        autofocus
        v-model="myGuess"
        ref="guessinput"
        v-on:keyup.enter="submitGuess"
      />
      <button v-on:click="submitGuess">{{ $t('guessingButtonSubmit') }}</button>
    </div>

    <div v-if="guesses.length != 0">{{ $t('guessingGuessesSoFar') }}</div>
    <ul>
      <li class="highlight" v-for="(guess, index) in guesses" v-bind:key="index">{{ guess }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import audioManager from "../../managers/audio_manager";
import { submitGuessingWord$ } from "../../managers/client_game_manager";

export default Vue.extend({
  props: [
    "isActivePlayer",
    "guessesLeft",
    "guesses",
    "userWords",
    "activePlayer",
    "wordToGuess",
    "hint",
    "isUserClose"
  ],
  data: () => {
    return {
      myGuess: "",
      hasError: false,
      errorMessage: ""
    };
  },
  methods: {
    submitGuess(): void {
      try {
        const sanitizedGuess = this.myGuess.toLowerCase().trim();
        if (this.isGuessValid(sanitizedGuess)) {
          this.hasError = false;
          this.errorMessage = "";
          submitGuessingWord$.next(this.myGuess);
          this.myGuess = "";
          this.$refs.guessinput.focus();
        }
      } catch (err) {
        this.hasError = true;
        this.errorMessage = err;
        audioManager.playForbidden();
      }
    },
    isGuessValid(s: string): boolean {
      if (!s) throw this.$t('guessingErrorEmptyWord');
      return true;
    }
  }
});
</script>

<style>
  #guess-input {
    text-transform: lowercase;
  }
  .close {
    color: blue;
  }
  .error {
    color: red;
  }
  .hint {
    letter-spacing: 0.2em;
  }
</style>