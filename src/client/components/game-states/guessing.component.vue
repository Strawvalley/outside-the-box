<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">{{ $t('guessingTitle') }}</p>
    <div class="mb-1" v-if="!isActivePlayer">{{ $t('guessingHintText1') }}</div>
    <div class="mb-1 highlight">{{ $t('guessingHintsTitle') }}</div>
    <ul class="mb-2">
      <li
        class="highlight"
        v-for="word in Object.keys(userWords)"
        v-bind:key="word"
      >{{ word.startsWith(token) ? userWords[word].join(", ") + $t('guessingHintsSameWord') : word }}</li>
    </ul>

    <div v-if="isActivePlayer">
      <div class="mb-2">
        {{ $t('guessingYouHave') }}
        <span class="highlight">{{guessesLeft}}</span>
        {{ $t('guessingGuessesLeft') }}
      </div>
      <input
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
      <li class="highlight" v-for="guess in guesses" v-bind:key="guess">{{ guess }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: [
    "isActivePlayer",
    "guessesLeft",
    "guesses",
    "userWords",
    "activePlayer"
  ],
  data: () => {
    return {
      myGuess: "",
      token: "<<"
    };
  },
  methods: {
    submitGuess(): void {
      this.$emit("submitGuess", this.myGuess);
      this.myGuess = "";
      this.$refs.guessinput.focus();
    }
  }
});
</script>