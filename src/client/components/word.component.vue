<template>
<div
  v-if="wordToGuess"
  class="card"
  v-bind:class="{ flipped: isFlipped }"
>
  <div class="face front highlight"> {{ wordToGuess }} </div>
  <div class="face back highlight"> BACK </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["wordToGuess"],
  data() {
    return {
      isFlipped: false,
    };
  },
});
</script>

<style lang="scss">
$transitionTime: .35s;
$transitionEase: cubic-bezier(0.13, 1.03, 0.39, 0.98);
$tiltAngle: 15deg;

.card{
  width: 180px;
  height: 80px;
  perspective: 100vw;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
  position: relative;
  margin: auto;
  margin-bottom: 1rem;

  .face{
    backface-visibility: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    transition: transform $transitionTime $transitionEase, 
                box-shadow $transitionTime $transitionEase, 
                border-width $transitionTime $transitionEase;
    box-shadow: 0px 3px 5px 3px rgba(0, 67, 72, 0.3);
    background-color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .front{
    transform: rotateX(0deg);
  }
  .back{
    transform: rotateX(180deg);
  }
  &:hover, &.hover{
    .front{
      transform: rotateX($tiltAngle);
      box-shadow: 0px 3px 7px 3px rgba(0, 67, 72, 0.3);
    }
    .back{
      transform: rotateX(180deg + $tiltAngle);
      box-shadow: 0px 3px 4px 2px rgba(0, 67, 72, 0.3);
    }
  }
  &.flipped{
    .front{transform: rotateX(180deg);}
    .back{transform: rotateX(360deg);}
    &:hover, &.hover{
      .front{transform: rotateX(180deg + $tiltAngle);}
      .back{transform: rotateX(360deg - $tiltAngle);}
    }
  }
}
</style>