<template>
  <div class="paused-overlay">
    <div>
      <h1>Game paused!</h1>
      <div>At least 3 players have to be connected!</div>
      <button v-if="isAdmin && canBeStarted" v-on:click="continueGame">Unpause game</button>
      <div v-if="!isAdmin">Please wait for the admin to unpause the game</div>
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
    background-color: rgba(0,0,0,0.5);
    z-index: 100;
    color: white;
    align-items: center;
    justify-content: center;
  }
</style>