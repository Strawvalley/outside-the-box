import Vue from "vue";

export const NotStarted = Vue.extend({
  props: ["isAdmin", "canBeStarted"],
  methods: {
    startGame(): void {
      this.$emit('startGame');
    }
  },
  template: `
  <div>
    <p>Not Started</p>
    <div v-if="!canBeStarted">You need at least 3 players to start the game!</div>
    <button v-if="isAdmin" v-on:click="startGame" :disabled="!canBeStarted">Start game</button>
    <div v-if="!isAdmin">Wait for admin to start the game!</div>
  </div>
  `
});
