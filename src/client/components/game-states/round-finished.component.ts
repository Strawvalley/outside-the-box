import Vue from "vue";

export const RoundFinished = Vue.extend({
  props: ["isActivePlayer", "wordToGuess", "userWords", "guesses", "pointsInRound"],
  methods: {
    startNextRound(): void {
      this.$emit('startNextRound');
    }
  },
  template: `
  <div>
    <h1>Round finished</h1>
    <ul>
    <li v-for="word in Object.keys(userWords)">
      {{ word }}: {{ userWords[word]}}
    </li>
    </ul>
    <div>The word to guess was: {{wordToGuess}}</div>
    <div>Guesses:</div>
    <ul>
      <li v-for="guess in guesses">
        {{ guess }}
      </li>
    </ul>
    <div>+{{pointsInRound}} Points</div>
    <button v-if="isActivePlayer" v-on:click="startNextRound">Start next round</button>
  </div>
  `
});
