import { GameState } from "../../shared/enums/game_state";
import { IGame } from "shared/models/igame";

export class Game implements IGame {
  started: boolean;
  admin: string;
  room: string;
  state: GameState;

  totalRounds: number;
  round: number;
  points: number;
  activePlayer: string;

  users: {
    [userId: string]: string;
  }
  wordToGuess: string;
  wordsInRound: {
    [username: string]: string;
  };

  constructor(admin: string, room: string) {
    this.started = false;
    this.admin = admin;
    this.room = room;
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
        // Check if all players (except activePlayer) submitted a word -> nextState
        const everyPlayerSubmittedWord = Object.keys(this.users)
          .filter(username => username !== this.activePlayer)
          .map(username => this.users[username])
          .every(username => this.wordsInRound[username] !== undefined);
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
