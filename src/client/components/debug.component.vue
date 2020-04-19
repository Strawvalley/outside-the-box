<template>
  <div>Debug: {{JSON.stringify(game)}}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { gameState$ } from "../managers/client_game_manager";
export default Vue.extend({
  props: ["socketId", "game"]
});
</script>
