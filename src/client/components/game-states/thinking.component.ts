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
    <div style="display: flex; flex-direction: column; text-align: center;">
      <p class="highlight">Thinking</p>
      <div v-if="!isActivePlayer">
        <div class="mb-2">The word in this round is: <span class="highlight">{{wordToGuess}}</span></div>
        <div v-if="!hasSubmittedWord">
          <input class="mb-2" autofocus v-model="word" />
          <button v-on:click="submitWord">Submit word</button>
        </div>
        <div v-if="hasSubmittedWord">
          <div>You submitted your word for this round!</div>
        </div>
      </div>
      <div v-if="isActivePlayer">
        <span>Wait for other players to submit their words.</span>
      </div>
    </div>
  `
});
