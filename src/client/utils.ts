import { GameDto, GameState, RoundDto } from "../shared";

export function setUsername(username: string): void {
  sessionStorage.setItem('username', username);
  document.querySelector('#username').textContent = username;
}

export function getUsername(): string {
  const username = sessionStorage.getItem('username');

  if (username) {
    setUsername(username);
    return username;
  }

  let newUsername = prompt('Please enter a username', '');

  // If no username entered by user, generate random
  if (!newUsername) {
    const randomNum = Math.floor(Math.random() * 1000);
    newUsername = 'user' + randomNum;
  }

  setUsername(newUsername);

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

let interval;

export function displayGameState(gameState: GameDto, id: string): void {

  const round: RoundDto = gameState.round;

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
  if (sessionStorage.getItem('username') === round.activePlayer) {
    game.classList.add('active-player');
  } else {
    game.classList.add('player');
  }

  // Update active-player / player
  if (gameState.paused) {
    game.classList.add('paused');
  }

  const numberOfConnectedPlayers = Object.values(gameState.users).filter(u => u.connected).length;
  if (numberOfConnectedPlayers < 3) {
    game.classList.add('can-not-be-started');
  }

  // Update Timer
  if (interval) clearInterval(interval);
  const time = document.querySelector('#time');
  if (round.secondsLeft !== undefined) {
    time.textContent = `Seconds left: ${round.secondsLeft}/${round.totalSeconds}`;
    if(!gameState.paused) {
      interval = setInterval(() => {
        round.secondsLeft--;
        time.textContent = `Seconds left: ${round.secondsLeft}/${round.totalSeconds}`;
        if (round.secondsLeft <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
  } else {
    time.textContent = ``;
  }

  // Update rounds
  const rounds = document.querySelector('#rounds');
  rounds.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;

  // Update points
  const points = document.querySelectorAll('.points');
  points.forEach(element => element.textContent = `${gameState.totalPoints}`);

  // Update users
  const userList = document.querySelector('#users');
  userList.innerHTML = '';
  Object.entries(gameState.users).forEach(([username, user]) => {
    const listItem = document.createElement('li');
    listItem.id = `user-${id}`;
    listItem.innerText = username;
    listItem.innerText += user.socketId === gameState.admin ? ` [ADMIN]` : ``;
    listItem.innerText += user.connected ? ` (connected)` : ` (disconnected)`;
    if (username === round.activePlayer) listItem.classList.add("is-active");
    userList.appendChild(listItem);
  });

  if (round.wordToGuess) {
    document.querySelectorAll<HTMLElement>('.word-to-guess').forEach((element) => {
      element.textContent = round.wordToGuess;
    });
  }

  if (gameState.state === GameState.SELECTING) {
    if (round.wordsForSelection) {
      document.querySelectorAll<HTMLUListElement>('.selection').forEach((list) => {
        list.innerHTML = ``;
        round.wordsForSelection.forEach((selection) => {
          const item = document.createElement('li');
          item.innerHTML = selection;
          list.appendChild(item);
        });
      });
    }
  }

  if (gameState.state === GameState.THINKING) {
    const thinkElement = document.querySelector<HTMLDivElement>('#think');
    thinkElement.style.display = round.usersSubmittedWordInRound.includes(gameState.username) ? 'none': 'block';
  }

  if (gameState.state === GameState.GUESSING) {
    // Update guesses left
    document.querySelectorAll<HTMLElement>('.guesses-left').forEach((element) => {
      element.textContent = round.guessesLeft.toString();
    });
    if (round.filteredWordsInRound) {
      document.querySelectorAll<HTMLElement>('.user-filtered-words').forEach((element) => {
        element.innerHTML = ``;
        Object.entries(round.filteredWordsInRound).forEach(([word, userList]) => {
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
      round.guesses.forEach((guess) => {
        const item = document.createElement('li');
        item.innerHTML = guess;
        list.appendChild(item);
      });
    });
  }

  if (gameState.state === GameState.ROUND_FINISHED) {
    if (round.wordsInRound) {
      document.querySelectorAll<HTMLElement>('.user-words').forEach((element) => {
        element.innerHTML = ``;
        Object.entries(round.wordsInRound).forEach(([word, usernames]) => {
          const div = document.createElement('div');
          div.innerHTML = `${usernames}: ${word}`;
          element.appendChild(div);
        });
      });
    }

    const result = document.querySelector('#result');
    result.textContent = `The word was ${round.wordWasGuessed ? '' : 'not'} guessed +${round.pointsInRound} Points -> Total Points: ${gameState.totalPoints}`;
  }

}
