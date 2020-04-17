import Vue from "vue";

export const Guessing = Vue.extend({
  props: ["isActivePlayer", "guessesLeft", "guesses", "userWords", "activePlayer"],
  data:() => {
    return {
      myGuess: ""
    }
  },
  methods: {
    submitGuess(): void {
      this.$emit('submitGuess', this.myGuess);
      this.myGuess = "";
      this.$refs.guessinput.focus();
    }
  },
  template: `
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">Guessing</p>
    <div class="mb-1" v-if="!isActivePlayer">The player is guessing the word.</div>
    <div class="mb-1 highlight">Hints:</div>
    <ul class="mb-2">
      <li class="highlight" v-for="word in Object.keys(userWords)">
        {{ word.startsWith('<<') ? userWords[word].join(", ") + ' had the same idea' : word }}
      </li>
    </ul>

    <div v-if="isActivePlayer">
      <div class="mb-2">You have <span class="highlight">{{guessesLeft}}</span> guesses left.</div>
      <input class="mb-2" autofocus v-model="myGuess" ref="guessinput" />
      <button v-on:click="submitGuess">Guess word</button>
    </div>

    <div v-if="!isActivePlayer" class="mb-2">
      <div><span class="highlight">{{activePlayer}}</span> has <span class="highlight">{{guessesLeft}}</span> guesses left.</div>
    </div>

    <div v-if="guesses.length != 0">Guesses so far:</div>
    <ul>
      <li class="highlight" v-for="guess in guesses">
        {{ guess }}
      </li>
    </ul>
  </div>
  `
});
