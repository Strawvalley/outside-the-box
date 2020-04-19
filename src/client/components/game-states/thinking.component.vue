<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">{{ $t('thinkingTitle') }}</p>
    <div v-if="!isActivePlayer">
      <div class="mb-2">
        {{ $t('thinkingHintText1') }}
        <span class="highlight">{{wordToGuess}}</span>
      </div>
      <div v-if="!hasSubmittedWord">
        <input class="mb-2" autofocus v-model="word" v-on:keyup.enter="submitWord" />
        <button v-on:click="submitWord">{{ $t('thinkingButtonSubmitWord') }}</button>
      </div>
      <div v-if="hasSubmittedWord">
        <div>{{ $t('thinkingHintText2') }}</div>
      </div>
    </div>
    <div v-if="isActivePlayer">
      <span>{{ $t('thinkingHintText3') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { submitThinkingWord$ } from "../../managers/client_game_manager";

export default Vue.extend({
  props: ["isActivePlayer", "usersSubmittedWordInRound", "wordToGuess", "username"],
  data: () => {
    return {
      word: ""
    };
  },
  computed: {
    hasSubmittedWord(): boolean {
      return this.usersSubmittedWordInRound.includes(
        this.username
      );
    }
  },
  methods: {
    submitWord(): void {
      submitThinkingWord$.next(this.word);
    }
  }
});
</script>