import { GameState } from "../enums/game_state";

export class Game {
  started: boolean = false;
  admin: string;
  room: string;
  state: GameState = GameState.NOT_STARTED;

  totalRounds: number = 10;
  round: number = 1;
  points: number = 0;
  activePlayer: string;

  users: {
    [userId: string]: string
  }
  wordToGuess: string;
  wordsInRound: {
    [username: string]: string
  };

  constructor(admin: string, room: string) {
    this.admin = admin;
    this.room = room;
    this.users = {};
    this.wordsInRound = {};
  }

  public startGame() {
    this.started = true;
    this.initiateNewRound();
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
        // Check if all players (except activePlayer) submitted a word -> nextState
        const everyPlayerSubmittedWord = Object.keys(this.users)
          .filter(username => username !== this.activePlayer)
          .map(username => this.users[username])
          .every(username => this.wordsInRound[username] !== undefined);
        if(everyPlayerSubmittedWord) {
          this.state = GameState.GUESSING;
        }
        break;
      }
    }
  }
  
  private initiateNewRound() {
    // TODO: Select user for round!
    this.activePlayer = Object.keys(this.users)[0];
    this.wordToGuess = this.generateWord();
    this.wordsInRound = {};
    this.state = GameState.THINKING;
    // TODO: Setup timer to go to next step
  }
  
  private generateWord(): string {
    return "GUESS ME I AM A WORD";
  }
}