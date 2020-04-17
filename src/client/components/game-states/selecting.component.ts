import Vue from "vue";

export const Selecting = Vue.extend({
  props: ["isActivePlayer", "wordsForSelection", "activePlayer"],
  methods: {
    selectWord(word: number): void {
      this.$emit('selectWord', word);
    }
  },
  template: `
    <div style="display: flex; flex-direction: column; text-align: center;">
      <p class="highlight">Selecting</p>
      <div v-if="isActivePlayer">
        <button v-on:click="selectWord(0)">Word 1</button>
        <button v-on:click="selectWord(1)">Word 2</button>
        <button v-on:click="selectWord(2)">Word 3</button>
      </div>
      <div v-if="!isActivePlayer">
        <div><span class="highlight">{{activePlayer}}</span> is selecting a number.</div>
        <div>Words behind the numbers:</div>
        <ul>
          <li class="highlight" v-for="word in wordsForSelection">
            {{wordsForSelection.indexOf(word) + 1}}: {{ word }}
          </li>
        </ul>
      </div>
    </div>
  `
});
