import Vue from "vue";

export const GameFinished = Vue.extend({
  props: ["isAdmin", "totalPoints", "canBeStarted"],
  methods: {
    startNewGame(): void {
      this.$emit('startNewGame');
    }
  },
  template: `
  <div>
    <h1>Game finished</h1>
    <div>Points: {{totalPoints}}</div>
    <div v-if="!canBeStarted">There are min 3 playsers required to start a new game.</div>
    <button v-if="isAdmin" v-on:click="startNewGame" :disabled="!canBeStarted">Start new game</button>
    <div v-if="!isAdmin">Please wait for the admin to start a new game!</div>
  </div>
  `
});
