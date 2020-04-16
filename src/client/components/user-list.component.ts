import Vue from "vue";

export const UserList = Vue.extend({
  props: ["users"],
  template: `
  <div>
    <h3>Users in room: </h3>
    <ul>
      <li v-for="user in users">
        {{ user }}
      </li>
    </ul>
  </div>
  `
});
