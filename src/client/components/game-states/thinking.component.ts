import Vue from "vue";

export const Thinking = Vue.extend({
  props: ["isActivePlayer", "hasSubmittedWord", "wordToGuess"],
  data:() => {
    return {
      word: ''
    }
  },
  methods: {
    submitWord(): void {
      this.$emit('submitWord', this.word);
    }
  },
  template: `
    <div>
      <h1>Thinking</h1>
      <div v-if="!isActivePlayer">
        <div>The word in this round is: {{wordToGuess}}</div>
        <div v-if="!hasSubmittedWord">
          <input v-model="word" />
          <button v-on:click="submitWord">Submit word</button>
        </div>
      </div>
      <div v-if="isActivePlayer">
        <span>Wait for other players to submit their words.</span>
      </div>
    </div>
  `
});
