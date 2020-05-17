<template>
  <div class="debug">
    <div class="header" v-on:click="toggleWindow">Debug Window</div>
    <div v-if="isOpen">
      <div class="content">
        <vue-json-pretty class="gameContainer" :data="game" :collapsedOnClickBrackets="false"></vue-json-pretty>
        <textarea
          v-model="input"
          v-bind:class="{error: hasError}"
          placeholder="Edit game object"
          ref="gameObjectTextArea"
        ></textarea>
        <button class="btn update" v-on:click="updateGameObject">Update</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueJsonPretty from "vue-json-pretty";

export default Vue.extend({
  props: ["socketId", "game", "updateGame"],
  components: {
    VueJsonPretty
  },
  data() {
    return {
      isOpen: true,
      input: "",
      error: false
    };
  },
  computed: {
    hasError: function() {
      return this.error && this.input != "";
    }
  },
  methods: {
    toggleWindow: function() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => {
          this.$refs.gameObjectTextArea.focus();
        });
      }
    },
    updateGameObject: function() {
      try {
        const newGameObject = JSON.parse(this.input);
        this.error = false;
        this.updateGame(newGameObject);
      } catch (err) {
        this.error = true;
        console.log(err);
      }
    }
  }
});
</script>

<style>
.debug {
  position: fixed;
  width: 400px;
  left: 15px;
  bottom: 0;
  z-index: 1337;
  font-size: 14px;
}
.header {
  display: flex;
  align-items: center;
  height: 30px;
  color: #ddfdff;
  padding: 10px;
  background-color: #068890;
  font-family: "Boogaloo", cursive;
  letter-spacing: 0.1em;
  border-radius: 5px 5px 0px 0px;
  cursor: pointer;
}
.content {
  background-color: #ddfdff;
  font-family: Consolas;
  padding: 0.5em;
  border-left: 1px solid #068890;
  border-right: 1px solid #068890;
}
.gameContainer {
  max-height: 500px;
  overflow: auto;
}
textarea {
  border: 1px solid #068890;
  padding: 0.25em;
  width: 100%;
  height: 150px;
  resize: none;
  color: #004348;
  margin-top: 10px;
}
.error {
  border: 1px solid red;
  color: #004348;
}
.btn-row {
  display: flex;
  flex-direction: row;
}
.btn {
  font-size: 14px;
  padding: 0.5em;
  border-radius: 5px;
  margin-top: 10px;
}
.update {
  width: 100%;
}
</style>