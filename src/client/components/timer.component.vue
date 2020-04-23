<template>
  <div
    class="highlight"
    style="position: absolute; right: 0; top: 0;"
  >{{internalSecondsLeft}} / {{totalSeconds}}</div>
</template>

<script lang="ts">
import Vue from "vue";
import audioManager from "../managers/audio_manager";

export default Vue.extend({
  props: ["totalSeconds", "secondsLeft", "paused", "playSound"],
  data() {
    return {
      t: undefined,
      internalSecondsLeft: parseInt(this.secondsLeft)
    };
  },
  watch: {
    secondsLeft(val): void {
      this.internalSecondsLeft = parseInt(val);
      if (this.t) clearInterval(this.t);
      this.t = this.startTimer();
    }
  },
  mounted() {
    if (this.t) clearInterval(this.t);
    this.t = this.startTimer();
  },
  methods: {
    startTimer() {
      return setInterval(() => {
        if (!this.paused) {
          this.internalSecondsLeft--;
          if (this.internalSecondsLeft <= 10 && this.playSound) {
            audioManager.playTimeTick();
          }
        }
        if (this.internalSecondsLeft <= 0) {
          clearInterval(this.t);
        }
      }, 1000);
    }
  },
  destroyed() {
    if (this.t) clearInterval(this.t);
  }
});
</script>