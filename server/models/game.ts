import { GameState, GameDto } from "../../shared";
import { Subject } from "rxjs";
import { filter, timeout, take } from "rxjs/operators";

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

  private everyPlayerSubmittedWord$: Subject<boolean> = new Subject<boolean>();
  private readonly THINKING_TIME_MS = 10000;

  constructor(admin: string, room: string, public updateGame: (room: string, payload: { gameState: GameDto}) => void) {
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

    // Check if all connected players (except activePlayer) submitted a word -> nextState
    const everyPlayerSubmittedWord = Object.entries(this.users)
      .filter(([username, user]) => username !== this.activePlayer && user.connected)
      .every(([username]) => this.wordsInRound[username] !== undefined);

    this.everyPlayerSubmittedWord$.next(everyPlayerSubmittedWord);
  }

  public guessWordForPlayer(username: string, word: string): void {
    if (this.state !== GameState.GUESSING) return;
    if (username !== this.activePlayer) return;

    // If word matched word to guess
    // TODO: Better word matching
    if (word.toLowerCase().trim() === this.wordToGuess.toLowerCase().trim()) {
      console.log("NICE");
    }
  }

  private initiateNewRound(): void {
    // TODO: Select user for round!
    this.activePlayer = Object.keys(this.users)[0];
    this.wordToGuess = this.generateWord();
    this.wordsInRound = {};
    this.state = GameState.THINKING;

    this.updateGame(this.room, this.toDto());
    this.everyPlayerSubmittedWord$.pipe(
      filter(everyPlayerSubmittedWord => everyPlayerSubmittedWord),
      timeout(this.THINKING_TIME_MS),
      take(1)
    ).subscribe(
      () => this.goToGuessing(),
      () => this.goToGuessing(),
    );
  }

  private goToGuessing(): void {
    this.state = GameState.GUESSING;
    this.updateGame(this.room, this.toDto());

    // TODO: START TIMER
  }

  private generateWord(): string {
    return "GUESS ME I AM A WORD";
  }

  public toDto(): { gameState: GameDto} {
    return {
      gameState: {
        started: this.started,
        admin: this.admin,
        state: this.state,
        totalRounds: this.totalRounds,
        round: this.round,
        points: this.points,
        activePlayer: this.activePlayer,
        users: this.users
      }
    };
  }
}
