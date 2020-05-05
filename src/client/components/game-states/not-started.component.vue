<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">{{ $t('notStartedTitle') }}</p>
    <div class="mb-2 highlight" v-if="isAdmin">
      <div>{{ $t('notStartedConfigGuessingTime') }}</div>
      <span class="no-select">
        <font-awesome-icon
          :class="canDecreaseGuessingTime ? 'active' : 'not-active'"
          :icon="['far', 'minus-square']"
          v-on:click="decreaseGuessingTime"
        ></font-awesome-icon>
        <span class="config">{{this.gameConfig.guessingTime}}</span>
        <font-awesome-icon
          :class="canIncreaseGuessingTime ? 'active' : 'not-active'"
          :icon="['far', 'plus-square']"
          v-on:click="increaseGuessingTime"
        ></font-awesome-icon>
      </span>
      <div>{{ $t('notStartedConfigNumRounds') }}</div>
      <span class="no-select">
        <font-awesome-icon
          :class="canDecreaseTotalRounds ? 'active' : 'not-active'"
          :icon="['far', 'minus-square']"
          v-on:click="decreaseTotalRounds"
        ></font-awesome-icon>
        <span class="config">{{this.gameConfig.totalRounds}}</span>
        <font-awesome-icon
          :class="canIncreaseTotalRounds ? 'active' : 'not-active'"
          :icon="['far', 'plus-square']"
          v-on:click="increaseTotalRounds"
        ></font-awesome-icon>
      </span>
    </div>
    <div class="mb-2" v-if="!canBeStarted">{{ $t('notStartedHintText1') }}</div>
    <button
      v-if="isAdmin"
      v-on:click="startGame"
      :disabled="!canBeStarted"
    >{{ $t('notStartedButtonStartGame') }}</button>
    <div v-if="!isAdmin">{{ $t('notStartedHintText2') }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { initiateGame$ } from "../../managers/client_game_manager";
import { defaults } from "../../../shared/models/defaults";
import audioManager from "../../managers/audio_manager";

export default Vue.extend({
  props: ["isAdmin", "canBeStarted", "gameConfig"],
  computed: {
    canIncreaseGuessingTime(): boolean {
      return this.gameConfig.guessingTime < defaults.guessingTime.max;
    },
    canDecreaseGuessingTime(): boolean {
      return this.gameConfig.guessingTime > defaults.guessingTime.min;
    },
    canIncreaseTotalRounds(): boolean {
      return this.gameConfig.totalRounds < defaults.totalRounds.max;
    },
    canDecreaseTotalRounds(): boolean {
      return this.gameConfig.totalRounds > defaults.totalRounds.min;
    },
  },
  methods: {
    startGame(): void {
      initiateGame$.next(this.gameConfig);
    },
    increaseGuessingTime(): void {
      if (this.canIncreaseGuessingTime) {
        this.gameConfig.guessingTime += defaults.guessingTime.increments;
        audioManager.playClick();
        this.updateGameConfig();
      } else {
        audioManager.playForbidden();
      }
    },
    decreaseGuessingTime(): void {
      if (this.canDecreaseGuessingTime) {
        this.gameConfig.guessingTime -= defaults.guessingTime.increments;
        audioManager.playClick();
        this.updateGameConfig();
      } else {
        audioManager.playForbidden();
      }
    },
    increaseTotalRounds(): void {
      if (this.canIncreaseTotalRounds) {
        this.gameConfig.totalRounds += defaults.totalRounds.increments;
        audioManager.playClick();
        this.updateGameConfig();
      } else {
        audioManager.playForbidden();
      }
    },
    decreaseTotalRounds(): void {
      if (this.canDecreaseTotalRounds) {
        this.gameConfig.totalRounds -= defaults.totalRounds.increments;
        audioManager.playClick();
        this.updateGameConfig();
      } else {
        audioManager.playForbidden();
      }
    },
    updateGameConfig(): void {
      this.$emit('updateGameConfig', this.gameConfig);
    }
  }
});
</script>

<style>
  .active {
    opacity: 1;
    cursor: pointer;
  }
  .not-active {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .config {
    font-size: 30px;
  }
  .no-select {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>