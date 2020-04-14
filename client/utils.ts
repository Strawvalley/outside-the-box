import { GameDto, GameState } from "../shared";

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

export function displayRoomName(room: string): void {
  document.querySelector('#room').textContent = room;
  window.history.pushState(room, 'Outside the box!', `/${room}`);
}

export function displayUsername(username: string): void {
  document.querySelector('#username').textContent = username;
}

let interval;

export function displayGameState(gameState: GameDto, id: string): void {

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
  if (sessionStorage.getItem('username') === gameState.activePlayer) {
    game.classList.add('active-player');
  } else {
    game.classList.add('player');
  }

  // Update Timer
  if (interval) clearInterval(interval);
  const time = document.querySelector('#time');
  if (gameState.secondsLeft !== undefined) {
    time.textContent = `Seconds left: ${gameState.secondsLeft}/${gameState.totalSeconds}`;
    interval = setInterval(() => {
      gameState.secondsLeft--;
      time.textContent = `Seconds left: ${gameState.secondsLeft}/${gameState.totalSeconds}`;
      if (gameState.secondsLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  } else {
    time.textContent = ``;
  }

  // Update rounds
  const rounds = document.querySelector('#rounds');
  rounds.textContent = `${gameState.round}/${gameState.totalRounds}`;

  // Update users
  const userList = document.querySelector('#users');
  userList.innerHTML = '';
  Object.entries(gameState.users).forEach(([username, user]) => {
    const listItem = document.createElement('li');
    listItem.id = `user-${id}`;
    listItem.innerText = username;
    listItem.innerText += user.socketId === gameState.admin ? ` [ADMIN]` : ``;
    listItem.innerText += user.connected ? ` (connected)` : ` (disconnected)`;
    if (username === gameState.activePlayer) listItem.classList.add("is-active");
    userList.appendChild(listItem);
  });

  if (gameState.wordToGuess) {
    document.querySelectorAll<HTMLElement>('.word-to-guess').forEach((element) => {
      element.textContent = gameState.wordToGuess;
    });
  }

  if (gameState.state === GameState.GUESSING) {
    // Update guesses left
    document.querySelectorAll<HTMLElement>('.guesses-left').forEach((element) => {
      element.textContent = gameState.guessesLeft.toString();
    });
    if (gameState.filteredWordsInRound) {
      document.querySelectorAll<HTMLElement>('.user-filtered-words').forEach((element) => {
        element.innerHTML = ``;
        Object.entries(gameState.filteredWordsInRound).forEach(([word, userList]) => {
          const div = document.createElement('div');
          if (userList.length > 1) {
            div.innerHTML = `"Damn we got the same word!": ${userList}`;
          } else {
            div.innerHTML = `${word}: ${userList}`;
          }
          element.appendChild(div);
        });
      });
    }
  }

  if (gameState.state === GameState.GUESSING || gameState.state === GameState.ROUND_FINISHED) {
    // Update list of guesses
    document.querySelectorAll<HTMLUListElement>('.guesses').forEach((list) => {
      list.innerHTML = ``;
      gameState.guesses.forEach((guess) => {
        const item = document.createElement('li');
        item.innerHTML = guess;
        list.appendChild(item);
      });
    });
  }

  if (gameState.state === GameState.ROUND_FINISHED) {
    if (gameState.wordsInRound) {
      document.querySelectorAll<HTMLElement>('.user-words').forEach((element) => {
        element.innerHTML = ``;
        Object.entries(gameState.wordsInRound).forEach(([word, usernames]) => {
          const div = document.createElement('div');
          div.innerHTML = `${usernames}: ${word}`;
          element.appendChild(div);
        });
      });
    }

    const result = document.querySelector('#result');
    if (gameState.wordWasGuessed) {
      result.textContent = `The word was guessed +${gameState.pointsInRound} Points -> Total Points: ${gameState.points}`;
    } else {
      result.textContent = `The word was not guessed +0 Points -> Total Points: ${gameState.points}`;
    }
  }

}
