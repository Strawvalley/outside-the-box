<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">{{ $t('selectingTitle') }}</p>
    <div v-if="isActivePlayer">
      <button v-on:click="selectWord(0)">{{ $t('selectingButtonWordSelect', ['1']) }}</button>
      <button v-on:click="selectWord(1)">{{ $t('selectingButtonWordSelect', ['2']) }}</button>
      <button v-on:click="selectWord(2)">{{ $t('selectingButtonWordSelect', ['3']) }}</button>
    </div>
    <div v-if="!isActivePlayer">
      <div>
        <span class="highlight">{{activePlayer}}</span>
        {{ $t('selectingHintText1') }}
      </div>
      <div>{{ $t('selectingHintText2') }}</div>
      <ul>
        <li
          class="highlight"
          v-for="word in wordsForSelection"
          v-bind:key="word"
        >{{wordsForSelection.indexOf(word) + 1}}: {{ word }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["isActivePlayer", "wordsForSelection", "activePlayer"],
  methods: {
    selectWord(word: number): void {
      this.$emit("selectWord", word);
    }
  }
});
</script>