import { GameState, GameDto } from "../../shared";

export class Game implements GameDto {
  started: boolean;
  admin: string;
  room: string;
  state: GameState;

  totalRounds: number;
  round: number;
  points: number;
  activePlayer: string;

  users: {
    [username: string]: {
      socketId: string;
      connected: boolean;
    };
  };

  // Extend the interface
  wordToGuess: string;
  wordsInRound: {
    [username: string]: string;
  };

  constructor(admin: string, room: string) {
    this.admin = admin;
    this.room = room;

    this.started = false;
    this.state = GameState.NOT_STARTED;
    this.totalRounds = 10;
    this.round = 1;
    this.points = 0;
    this.users = {};
    this.wordsInRound = {};
  }

  public startGame(): void {
    this.started = true;
    this.initiateNewRound();
  }

  public submitWordForPlayer(username: string, word: string): void {
    if (this.state !== GameState.THINKING) return;
    if (username === this.activePlayer) return;
    if (this.wordsInRound[username] !== undefined) return;

    // Set word for this player in this round
    this.wordsInRound[username] = word;
    this.tryNextState();
  }

  public tryNextState(): void {
    switch (this.state) {
      case GameState.THINKING: {
        // Check if all connected players (except activePlayer) submitted a word -> nextState
        const everyPlayerSubmittedWord = Object.entries(this.users)
          .filter(([username, user]) => username !== this.activePlayer && user.connected)
          .every(([username]) => this.wordsInRound[username] !== undefined);

        if (everyPlayerSubmittedWord) {
          this.state = GameState.GUESSING;
        }

        break;
      }
    }
  }

  private initiateNewRound(): void {
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
