import Vue from "vue";

export const Timer = Vue.extend({
  props: ["totalSeconds", "secondsLeft", "paused"],
  data() {
    return {
      t: undefined,
      internalSecondsLeft: parseInt(this.secondsLeft)
    };
  },
  watch: {
    secondsLeft(val): void {
      this.internalSecondsLeft = parseInt(val);
      if(this.t) clearInterval(this.t);
      this.t = setInterval(() => {
        if (!this.paused) {
          this.internalSecondsLeft--;
        }
        if (this.internalSecondsLeft == 0 ) {
          clearInterval(this.t);
        }
      }, 1000);
    }
  },
  mounted() {
    if(this.t) clearInterval(this.t);
    this.t = setInterval(() => {
       this.internalSecondsLeft--;
    }, 1000);
  },
  destroyed() {
    if(this.t) clearInterval(this.t);
  },
  template: `
  <div>
    {{internalSecondsLeft}} / {{totalSeconds}}
  </div>
  `
});
