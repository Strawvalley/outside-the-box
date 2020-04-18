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
    <p class="highlight mb-2">{{ $t('gameFinishedTitle') }}</p>
    <div class="mb-2">{{ $t('gameFinishedTotalPoints') }} <span class="highlight">{{totalPoints}}</span></div>
    <div v-if="!canBeStarted" class="mb-2">{{ $t('gameFinishedHintText1') }}</div>

    <button v-if="isAdmin" v-on:click="startNewGame" :disabled="!canBeStarted">{{ $t('gameFinishedButtonStartGame') }}</button>
    <div v-if="!isAdmin">{{ $t('gameFinishedHintText2') }}</div>

  </div>
  `
});
