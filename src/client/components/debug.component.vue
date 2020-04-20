<template>
  <div style="font-family: Consolas; font-size: 14px;">Debug: {{JSON.stringify(game)}}</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["socketId", "game"]
});
</script>
