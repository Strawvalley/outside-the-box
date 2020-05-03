<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight mb-2">{{ $t('gameFinishedTitle') }}</p>
    <div class="mb-2">
      {{ $t('gameFinishedTotalPoints') }}
      <span class="highlight">{{totalPoints}}</span>
    </div>
    <div v-if="!canBeStarted" class="mb-2">{{ $t('gameFinishedHintText1') }}</div>

    <button
      v-if="isAdmin"
      v-on:click="startNewGame"
      :disabled="!canBeStarted"
    >{{ $t('gameFinishedButtonStartGame') }}</button>
    <div v-if="!isAdmin">{{ $t('gameFinishedHintText2') }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { initiateGame$ } from "../../managers/client_game_manager";

export default Vue.extend({
  props: ["isAdmin", "totalPoints", "canBeStarted", "gameConfig"],
  methods: {
    startNewGame(): void {
      initiateGame$.next(this.gameConfig);
    }
  }
});
</script>