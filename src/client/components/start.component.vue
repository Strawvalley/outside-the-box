<template>
  <div class="start-screen highlight">
    <div class="select-wrapper">
      <select v-model="selectedLocale" @change="changeLocale">
        <option
          v-for="(option, index) in locales"
          v-bind:value="option.locale"
          v-bind:key="index"
        >{{ option.title }}</option>
      </select>
    </div>

    <div class="mb-1">{{ $t('roomEnterUsername') }}</div>
    <input
      class="mb-2"
      v-model="usernameInput"
      type="text"
      maxlength="12"
      v-on:keyup.enter="onEnterKeyUp"
      autofocus
    />
    <div class="mb-2">{{ $t('roomAnd') }}</div>
    <div class="mb-2">
      <button
        class="large"
        v-on:click="createGame"
        v-if="!hasRoomInPath"
      >{{ $t('roomButtonCreateGame') }}</button>
    </div>
    <div class="mb-2">
      <span v-if="!hasRoomInPath">{{ $t('roomOr') }}</span>
      <input style="max-width: 115px;" v-model="gameInput" :disabled="hasRoomInPath" />
      <button v-on:click="joinGame" ontouchstart>{{ $t('roomButtonJoinGame') }}</button>
    </div>

    <h3 class="highlight mb-2">{{ $t('roomInstructionTitle') }}</h3>
    <p>
      <i18n path="roomInstructionParagraph1">
        <span class="highlight">{{ $t('roomInstructionParagraph1Guesser') }}</span>
      </i18n>
    </p>
    <p>
      <i18n path="roomInstructionParagraph2">
        <span class="highlight">{{ $t('roomInstructionParagraph2Hint') }}</span>
      </i18n>
    </p>
    <p>
      <i18n path="roomInstructionParagraph3">
        <span class="highlight">{{ $t('roomInstructionParagraph3FigureWord') }}</span>
      </i18n>
    </p>
    <p>
      <i18n path="roomInstructionParagraph4">
        <span class="highlight">{{ $t('roomInstructionParagraph4Twist') }}</span>
        <span class="highlight">{{ $t('roomInstructionParagraph4Unique') }}</span>
        <span class="highlight">{{ $t('roomInstructionParagraph4OutsideTheBox') }}</span>
      </i18n>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import i18n from "../plugins/i18n";
import { createOrJoinGame$ } from "../managers/client_game_manager";
import audioManager from "client/managers/audio_manager";

export default Vue.extend({
  data() {
    return {
      gameInput: location.pathname.split("/")[1],
      usernameInput: sessionStorage.getItem("username"),
      locales: [
        { locale: "en", title: "English" },
        { locale: "de", title: "Deutsch" }
      ],
      selectedLocale: i18n.locale
    };
  },
  computed: {
    hasRoomInPath(): boolean {
      return !!location.pathname.split("/")[1];
    }
  },
  methods: {
    onEnterKeyUp(): void {
      this.hasRoomInPath ? this.joinGame() : this.createGame();
    },
    createGame(): void {
      audioManager.playJoinGame();
      createOrJoinGame$.next({
        username: this.usernameInput,
        lang: i18n.locale
      });
    },
    joinGame(): void {
      audioManager.playJoinGame();
      createOrJoinGame$.next({
        room: this.gameInput,
        username: this.usernameInput
      });
    },
    changeLocale(event): void {
      i18n.locale = event.target.value;
      localStorage.setItem("locale", event.target.value);
    }
  }
});
</script>
