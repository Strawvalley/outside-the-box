<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">{{ $t('notStartedTitle') }}</p>
    <div class="mb-2 highlight" v-if="isAdmin">
      <div>Guessing Time</div>
      <span class="no-select">
        <font-awesome-icon
          class="icon-button"
          :class="canDecreaseGuessingTime ? 'active' : 'not-active'"
          icon="less-than"
          v-on:click="decreaseGuessingTime"
        ></font-awesome-icon>
        <span class="config">{{this.gameConfig.guessingTime}}</span>
        <font-awesome-icon
          class="icon-button"
          :class="canIncreaseGuessingTime ? 'active' : 'not-active'"
          icon="greater-than"
          v-on:click="increaseGuessingTime"
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

export default Vue.extend({
  props: ["isAdmin", "canBeStarted"],
  data: () => {
    return {
      gameConfig: {
        guessingTime: defaults.guessingTimeRange.default
      },
    };
  },
  computed: {
    canIncreaseGuessingTime(): boolean {
      return this.gameConfig.guessingTime < defaults.guessingTimeRange.max;
    },
    canDecreaseGuessingTime(): boolean {
      return this.gameConfig.guessingTime > defaults.guessingTimeRange.min;
    },
  },
  methods: {
    startGame(): void {
      initiateGame$.next(this.gameConfig);
    },
    increaseGuessingTime(): void {
      if (this.canIncreaseGuessingTime) this.gameConfig.guessingTime += defaults.guessingTimeRange.increments;
    },
    decreaseGuessingTime(): void {
      if (this.canDecreaseGuessingTime) this.gameConfig.guessingTime -= defaults.guessingTimeRange.increments;
    }
  }
});
</script>

<style>
  .active {
    opacity: 1;
  }
  .not-active {
    opacity: 0.5;
  }
  .config {
    font-size: 30px;
  }
  .icon-button {
    cursor: pointer;
  }
  .no-select {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>