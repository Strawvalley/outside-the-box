import Vue from "vue";

export const Guessing = Vue.extend({
  props: ["isActivePlayer", "guessesLeft", "guesses", "userWords"],
  data:() => {
    return {
      myGuess: ""
    }
  },
  methods: {
    submitGuess(): void {
      this.$emit('submitGuess', this.myGuess);
    }
  },
  template: `
  <div>
    <h1>Guessing</h1>
    <div v-if="!isActivePlayer">The player is guessing the word.</div>

    <ul>
      <li v-for="word in userWords">
        {{ word }}
      </li>
    </ul>

    <div v-if="isActivePlayer">
      <div>You have {{guessesLeft}} guesses left.</div>
      <input v-model="myGuess" />
      <button v-on:click="submitGuess">Guess word</button>
    </div>

    <div v-if="!isActivePlayer">
      <div>He has {{guessesLeft}} guesses left.</div>
    </div>

    <div>Guesses so far:</div>
    <ul>
      <li v-for="guess in guesses">
        {{ guess }}
      </li>
    </ul>
  </div>
  `
});
