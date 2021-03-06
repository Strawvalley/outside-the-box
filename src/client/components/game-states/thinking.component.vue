<template>
  <div style="display: flex; flex-direction: column; text-align: center;">

    <div v-if="!isActivePlayer">
      <!--<div class="mb-2">
        {{ $t('thinkingHintText1') }}
        <span class="highlight">{{wordToGuess}}</span>
      </div>-->
      <p class="error" v-if="hasError">{{errorMessage}}</p>
      <div v-if="!(hasSentWordToServer || hasSubmittedWord)">
        <input id="think-input" class="mb-2" autofocus v-model="word" v-on:keyup.enter="submitWord" />
        <button v-on:click="submitWord">{{ $t('thinkingButtonSubmitWord') }}</button>
      </div>
      <div class="mb-2" v-if="hasSubmittedWord">
        <i18n path="thinkingHintText2" tag="div">
          <template v-slot:submittedWordByUser>
            <span class="highlight">{{ submittedWordByUser }}</span>
          </template>
        </i18n>
      </div>
    </div>
    <div v-if="isActivePlayer">
      <span>{{ $t('thinkingHintText3') }}</span>
    </div>
    <div>
      <span class="highlight">{{ otherUsersSubmittedWords.join(', ') }}</span> {{ $tc('thinkingHintText4', otherUsersSubmittedWords.length ) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { submitThinkingWord$ } from "../../managers/client_game_manager";
import audioManager from "../../managers/audio_manager";

export default Vue.extend({
  props: [
    "isActivePlayer",
    "submittedWordByUser",
    "usersSubmittedWordInRound",
    "wordToGuess",
    "username"
  ],
  data: () => {
    return {
      word: "",
      hasSentWordToServer: false,
      hasError: false,
      errorMessage: ""
    };
  },
  computed: {
    hasSubmittedWord(): boolean {
      return this.usersSubmittedWordInRound.includes(
        this.username
      );
    },
    otherUsersSubmittedWords(): string[] {
      return this.usersSubmittedWordInRound.filter(u => u !== this.username);
    },
    otherUsersHaveSubmittedWords(): boolean {
      return this.otherUsersSubmittedWords.length > 0;
    }
  },
  methods: {
    submitWord(): void {
      try {
        const sanitizedWord = this.word.toLowerCase().trim();
        if (this.isWordValid(sanitizedWord)) {
          this.hasSentWordToServer = true;
          this.hasError = false;
          this.errorMessage = "";
          submitThinkingWord$.next(this.word);
        }
      } catch (err) {
        this.hasError = true;
        this.errorMessage = err;
        audioManager.playForbidden();
      }

    },
    isWordValid(s: string): boolean {
      if (!s) throw this.$t('thinkingErrorEmptyWord');
      if (s === this.wordToGuess) throw this.$t('thinkingErrorHintEqualGuess');
      if (this.hasWhiteSpace(s)) throw this.$t('thinkingErrorMultipleWords');
      return true;
    },
    hasWhiteSpace(s: string): boolean {
      return /\s/g.test(s);
    }
  }
});
</script>

<style>
  #think-input {
    text-transform: lowercase;
  }
  .error {
    color: red;
  }
</style>