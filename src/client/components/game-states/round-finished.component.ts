import Vue from "vue";

export const RoundFinished = Vue.extend({
  props: ["isActivePlayer", "wordToGuess", "userWords", "guesses", "pointsInRound"],
  methods: {
    startNextRound(): void {
      this.$emit('startNextRound');
    }
  },
  template: `
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight mb-2">{{ $t('roundFinishedTitle') }}</p>
    <ul class="mb-2">
      <li class="highlight" v-for="word in Object.keys(userWords)">
        {{ word }}: {{ userWords[word].join(", ")}}
      </li>
    </ul>
    <div class="mb-2">{{ $t('roundFinishedWordWas') }} <span class="highlight">{{wordToGuess}}</span></div>
    <div v-if="guesses.length != 0">{{ $t('roundFinishedGuesses') }}</div>
    <ul class="mb-2">
      <li class="highlight" v-for="guess in guesses">
        {{ guess }}
      </li>
    </ul>
    <div class="highlight mb-2">+{{pointsInRound}} {{ $t('roundFinishedPoints') }}</div>
    <button v-if="isActivePlayer" v-on:click="startNextRound">{{ $t('roundFinishedButtonStartNextRound') }}</button>
  </div>
  `
});
