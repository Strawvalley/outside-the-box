import Vue from "vue";

export const Selecting = Vue.extend({
  props: ["isActivePlayer", "wordsForSelection"],
  data: () => {
    return {
      selected: "0"
    }
  },
  methods: {
    selectWord(): void {
      this.$emit('selectWord', this.selected);
    }
  },
  template: `
    <div>
      <h1>Selecting</h1>
      <div v-if="isActivePlayer">
        <div>Please choose a number</div>
        <select v-model="selected">
          <option value="0">1</option>
          <option value="1">2</option>
          <option value="2">3</option>
        </select>
        <button v-on:click="selectWord">Select</button>
      </div>
      <div v-if="!isActivePlayer">
        <div>The active player is selecting a number.</div>
        <div>Words to choose from:</div>
        <ul>
          <li v-for="word in wordsForSelection">
            {{ word }}
          </li>
        </ul>
      </div>
    </div>
  `
});
