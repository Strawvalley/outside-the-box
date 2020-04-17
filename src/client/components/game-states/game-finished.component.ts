import Vue from "vue";

export const GameFinished = Vue.extend({
  props: ["isAdmin", "totalPoints", "canBeStarted"],
  methods: {
    startNewGame(): void {
      this.$emit('startNewGame');
    }
  },
  template: `
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight mb-2">Game finished</p>
    <div class="mb-2">Total Points: <span class="highlight">{{totalPoints}}</span></div>
    <div v-if="!canBeStarted" class="mb-2">There are min 3 playsers required to start a new game.</div>

    <button v-if="isAdmin" v-on:click="startNewGame" :disabled="!canBeStarted">Start new game</button>
    <div v-if="!isAdmin">Please wait for the admin to start a new game!</div>

  </div>
  `
});
