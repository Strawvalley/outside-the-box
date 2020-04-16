import Vue from "vue";

export const UserList = Vue.extend({
  props: ["users", "admin"],
  template: `
  <div>
    <h3>Users in room: </h3>
    <ul>
      <li v-for="user in Object.keys(users)">
        {{ user }} {{ users[user].connected ? '(c)' : '(d)' }} {{users[user].socketId === admin ? "ADMIN" : ""}}
      </li>
    </ul>
  </div>
  `
});
