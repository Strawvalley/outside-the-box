import io from 'socket.io';

export const games: {
  [key: string]: Game
} = {};

export enum GameState {
  NOT_STARTED = "NOT_STARTED",
  THINKING = "THINKING",
  GUESSING = "GUESSING",
  ROUND_FINISHED = "ROUND_FINISHED",
  GAME_FINISHED = "GAME_FINISHED"
}

export class Game {
  started: boolean = false;
  admin: string;
  room: string;
  state: GameState = GameState.NOT_STARTED;

  totalRounds: number = 10;
  round: number = 1;
  points: number = 0;
  activePlayer: string;

  private users: string[] = [];
  private wordToGuess: string;
  private wordsInRound: {
    [username: string]: string
  };

  constructor(admin: string, room: string) {
    this.admin = admin;
    this.room = room;
  }

  public startGame() {
    this.started = true;
    this.wordToGuess = "GUESS ME I AM A WORD"; // TODO
    this.wordsInRound = {};
    this.state = GameState.THINKING;
    // Setup timer to go to next step
  }

  public submitWordForPlayer(username: string, word: string) {
    if (this.state !== GameState.THINKING) return;
    if (username === this.activePlayer) return;
    if (this.wordsInRound[username] !== undefined) return;

    // Set word for this player in this round
    this.wordsInRound[username] = word;
    this.tryNextState();
  }

  public tryNextState() {
    switch (this.state) {
      case GameState.THINKING: {
        // Check if all players submitted a word -> nextState
        if (Object.keys(this.wordsInRound).length === this.users.length - 1) {
          this.state = GameState.GUESSING;
        }
        break;
      }
    }
  }

  public addUser(username: string) {
    this.users.push(username);
  }

  public removeUser(username: string) {
    this.users = this.users.filter(u => u !== username);
  }
}

export function createNewGame(room: string, admin: string): Game {
  const newGame = new Game(admin, room);
  games[room] = newGame;
  return newGame;
}