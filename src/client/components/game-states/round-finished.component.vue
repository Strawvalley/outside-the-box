<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight mb-2">{{ $t('roundFinishedTitle') }}</p>
    <ul class="mb-2">
      <li
        class="highlight"
        v-for="(word, index) in Object.keys(userWords)"
        v-bind:key="index"
      >{{ word }}: {{ userWords[word].join(", ")}}</li>
    </ul>
    <div class="mb-2">
      {{ $t('roundFinishedWordWas') }}
      <span class="highlight">{{wordToGuess}}</span>
    </div>
    <div v-if="guesses.length != 0">{{ $t('roundFinishedGuesses') }}</div>
    <ul class="mb-2">
      <li class="highlight" v-for="(guess, index) in guesses" v-bind:key="index">{{ guess }}</li>
    </ul>
    <div class="highlight mb-2">+{{pointsInRound}} {{ $t('roundFinishedPoints') }}</div>
    <button
      v-if="isActivePlayer"
      v-on:click="startNextRound"
    >{{ $t('roundFinishedButtonStartNextRound') }}</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { startNextRound$ } from "../../managers/client_game_manager";

export default Vue.extend({
  props: [
    "isActivePlayer",
    "wordToGuess",
    "userWords",
    "guesses",
    "pointsInRound"
  ],
  methods: {
    startNextRound(): void {
      startNextRound$.next();
    }
  }
});
</script>