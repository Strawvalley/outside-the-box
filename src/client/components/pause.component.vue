<template>
  <div class="paused-overlay">
    <div style="display: flex; justify-content: center; flex-direction: column;">
      <h1 class="mb-2">{{ $t('pauseTitle') }}</h1>
      <div class="mb-2" v-if="!canBeStarted">{{ $t('pauseHintText1') }}</div>
      <button v-if="isAdmin" v-on:click="continueGame" :disabled="!canBeStarted">{{ $t('pauseButtonUnpauseGame') }}</button>
      <div v-if="!isAdmin">{{ $t('pauseHintText2') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["isAdmin", "canBeStarted"],
  methods:{
    continueGame(): void {
      this.$emit("continueGame");
    }
  }
});
</script>

<style>
  .paused-overlay {
    display: flex;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,32,34,0.85);
    z-index: 100;
    align-items: center;
    justify-content: center;
  }
  .paused-overlay * {
    color: #DDFDFF;
    text-align: center;
  }
</style>