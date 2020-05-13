<template>
  <div style="display: flex;" v-if="showWizard">
    <ul class="progressbar highlight">
      <li v-bind:class="{active: highlightFirstStep}">{{ $t('selectingTitle') }}</li>
      <li v-bind:class="{active: highlightSecondStep}"> {{ $t('thinkingTitle')  }}</li>
      <li v-bind:class="{active: highlightThirdStep}">{{ $t('guessingTitle') }}</li>
      <li v-bind:class="{active: highlightFourthStep}">{{ $t('roundFinishedTitle') }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GameState } from "../../shared";

export default Vue.extend({
  props: ["state"],
  computed: {
    showWizard(): boolean {
      return this.state === GameState.SELECTING || this.state === GameState.THINKING || this.state === GameState.GUESSING || this.state === GameState.ROUND_FINISHED;
    },
    highlightFirstStep(): boolean {
      return this.state === GameState.SELECTING || this.state === GameState.THINKING || this.state === GameState.GUESSING || this.state === GameState.ROUND_FINISHED;
    },
    highlightSecondStep(): boolean {
      return this.state === GameState.THINKING || this.state === GameState.GUESSING || this.state === GameState.ROUND_FINISHED;
    },
    highlightThirdStep(): boolean {
      return this.state === GameState.GUESSING || this.state === GameState.ROUND_FINISHED;
    },
    highlightFourthStep(): boolean {
      return this.state === GameState.ROUND_FINISHED;
    }
  }
});
</script>

<style lang="scss">
.progressbar {
  counter-reset: step;
  position: relative;
  z-index: 10;
  width: 100%;
  margin-bottom: 1rem;
}
.progressbar li {
  list-style-type: none;
  width: 25%;
  float: left;
  font-size: 12px;
  position: relative;
  text-align: center;
  color: #7d7d7d;
}
.progressbar li:before {
  width: 30px;
  height: 30px;
  content: counter(step);
  counter-increment: step;
  line-height: 30px;
  border: 2px solid #7d7d7d;
  display: block;
  text-align: center;
  margin: 0 auto 3px auto;
  border-radius: 50%;
  background-color: #DDFDFF;
}
.progressbar li:after {
  width: 100%;
  height: 2px;
  content: '';
  position: absolute;
  background-color: #7d7d7d;
  top: 15px;
  left: -50%;
  z-index: -1;
}
.progressbar li:first-child:after {
  content: none;
}
.progressbar li.active {
  color: #004348;
}
.progressbar li.active:before {
  border-color: #068890;
}
.progressbar li.active:after {
  background-color: #068890;
}
</style>