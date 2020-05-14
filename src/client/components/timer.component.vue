<template>
  <div class="container">
    <canvas id="seconds-canvas" width="100" height="100"></canvas>
    <svg width="100" height="100">
      <circle id="outer" cx="50" cy="50" r="40" fill="transparent" stroke-width="10" stroke="#068890" opacity="0.1"/>
    </svg>
    <div class="label highlight" v-if="showTimer">
      {{internalSecondsLeft}} <span class="small">/ {{totalSeconds}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import audioManager from "../managers/audio_manager";

export default Vue.extend({
  props: ["totalSeconds", "secondsLeft", "paused", "playSound", "showTimer"],
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
      this.render();
      return setInterval(() => {
        if (!this.paused) {
          this.internalSecondsLeft--;
          if (this.internalSecondsLeft <= 10 && this.playSound) {
            audioManager.playTimeTick();
          }
          this.render();
        }
        if (this.internalSecondsLeft <= 0) {
          clearInterval(this.t);
        }
      }, 1000);
    },
    deg(d) {
      // Convert radians to degrees
      return (Math.PI/180)*d-(Math.PI/180)*90;
    },
    render() {
      const c = (document.getElementById('seconds-canvas') as HTMLCanvasElement).getContext('2d');
      c.clearRect(0, 0, 100, 100);
      c.beginPath();
      c.strokeStyle = "#068890";
      c.arc(50, 50, 40, this.deg(0), this.deg(360/this.totalSeconds * this.internalSecondsLeft));
      c.lineWidth = 10;
      //c.lineCap = "round"; 
      c.stroke();
    }
  },
  destroyed() {
    if (this.t) clearInterval(this.t);
  }
});
</script>

<style lang="scss">
.container {
  position: relative;
  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
  .label {
    position: absolute;
    min-width: 50px;
    top: 35px;
    left: 25px;
    text-align: center;
    font-size: 1rem;
    display: inline-block;
    .small {
      display: inline-block;
      font-size: 0.5rem;
    }
  }
}  
</style>