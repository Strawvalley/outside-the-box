<template>
  <div style="display: flex; flex-direction: column; text-align: center;">
    <p class="highlight">{{ $t('notStartedTitle') }}</p>
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

export default Vue.extend({
  props: ["isAdmin", "canBeStarted"],
  methods: {
    startGame(): void {
      this.$emit("startGame");
    }
  }
});
</script>