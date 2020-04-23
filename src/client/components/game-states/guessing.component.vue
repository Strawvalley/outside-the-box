<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">{{ $t('guessingTitle') }}</p>
    <div class="mb-2" v-if="!isActivePlayer">
      {{ $t('guessingHintText2') }}
      <span class="highlight">{{wordToGuess}}</span>
    </div>
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

    <div v-if="isActivePlayer">
      <div class="mb-2">
        {{ $t('guessingYouHave') }}
        <span class="highlight">{{guessesLeft}}</span>
        {{ $t('guessingGuessesLeft') }}
      </div>
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

    <div v-if="!isActivePlayer" class="mb-2">
      <div>
        <span class="highlight">{{activePlayer}}</span>
        {{ $t('guessingHas') }}
        <span class="highlight">{{guessesLeft}}</span>
        {{ $t('guessingGuessesLeft') }}
      </div>
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
    "wordToGuess"
  ],
  data: () => {
    return {
      myGuess: ""
    };
  },
  methods: {
    submitGuess(): void {
      if (this.myGuess && this.myGuess.trim().length) {
        submitGuessingWord$.next(this.myGuess);
        this.myGuess = "";
        this.$refs.guessinput.focus();
      } else {
        audioManager.playForbidden();
      }
    }
  }
});
</script>

<style>
  #guess-input {
    text-transform: lowercase;
  }
</style>