import { IGame } from "../shared/models/igame";

export function getUsername(): string {
  const username = sessionStorage.getItem('username');

  if (username) return username;

  let newUsername = prompt('Please enter a username', '');

  // If no username entered by user, generate random
  if (!newUsername) {
    const randomNum = Math.floor(Math.random() * 1000);
    newUsername = 'user' + randomNum;
  }

  sessionStorage.setItem('username', newUsername);

  return newUsername;
}

export function getRoom(): string {
  const roomName = location.pathname.split('/')[1]
  if (!roomName) return Math.floor(Math.random() * 100000).toString();
  return roomName;
}

export function addUser(id: string, username: string, isAdmin: boolean): void {
  document.querySelector('#users')
    .insertAdjacentHTML(
      'beforeend',
      `<li ${ isAdmin ? 'class="is-admin"': ''} id="user-${id}">${username}</li>`
    );
}

export function removeUser(id: string): void {
  const userToRemove = document.querySelector(`#users #user-${id}`);

  if (userToRemove) {
    userToRemove.parentNode.removeChild(userToRemove);
  }
}

export function clearUsers(): void {
  document.querySelector('#users').innerHTML = '';
}

export function displayRoomName(room: string): void {
  document.querySelector('#room').textContent = room;
  window.history.pushState(room, 'Outside the box!', `/${room}`);
}

export function displayUsername(username: string): void {
  document.querySelector('#username').textContent = username;
}

export function displayGameState(gameState: IGame, id: string): void {

  document.querySelector('#state').textContent = JSON.stringify(gameState);

  // Display game state and update admin / non-admin
  const game = document.querySelector('.game');
  game.className = `game ${gameState.state}`;
  if (id === gameState.admin) {
    game.classList.add('admin');
  } else {
    game.classList.add('non-admin');
  }

  // Update active-player / player
  if (id === gameState.activePlayer) {
    game.classList.add('active-player');
  } else {
    game.classList.add('player');
  }

}
