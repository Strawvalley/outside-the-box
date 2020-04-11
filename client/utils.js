export function getUsername() {
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

export function getRoom() {
  const roomName = location.pathname.split('/')[1]
  if (!roomName) return Math.floor(Math.random() * 100000);
  return roomName;
}

export function addUser(id, username) {
  document.querySelector('#users')
    .insertAdjacentHTML(
      'beforeend',
      `<li id="user-${id}">${username}</li>`
    );
}

export function removeUser(id) {
  const userToRemove = document.querySelector(`#users #user-${id}`);

  if (userToRemove) {
    userToRemove.parentNode.removeChild(userToRemove);
  }
}

export function clearUsers() {
  document.querySelector('#users').innerHTML = '';
}

export function displayRoomName(room) {
  document.querySelector('#room').textContent = room;
  window.history.pushState(room, 'Outside the box!', `/${room}`);
}

export function displayUsername(username) {
  document.querySelector('#username').textContent = username;
}

export function displayGameState(gameState, id) {

  document.querySelector('#state').textContent = JSON.stringify(gameState);

  // Highlight the admin in user list
  const userElement = document.querySelector(`#user-${gameState.admin}`);
  if (userElement) {
    userElement.style.fontWeight = 700;
  }

  // Display game state and update admin / non-admin
  const game = document.querySelector('.game');
  game.className = `game ${gameState.state}`;
  if (id === gameState.admin) {
    game.classList.add('admin');
  } else {
    game.classList.add('non-admin');
  }

}
