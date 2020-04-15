import { GameState, GameDto } from "../../shared";
import { Subject, merge, interval, Observable } from "rxjs";
import { tap, map, first, takeUntil } from "rxjs/operators";
import { logInfo, logWarning } from "../managers/log_manager";
import { WordManager } from "../managers/word_manager";

export class Game {

  started: boolean;
  admin: string;
  room: string;
  state: GameState;

  totalRounds: number;
  round: number;
  points: number;
  pointsInRound: number;
  activePlayer: string;
  totalSeconds: number;
  secondsLeft: number;

  users: {
    [username: string]: {
      socketId: string;
      connected: boolean;
    };
  };

  wordToGuess?: string;
  wordsInRound?: {
    [word: string]: string[];
  };
  filteredWordsInRound?: {
    [word: string]: string[];
  };
  guesses?: string[];
  guessesLeft?: number;
  wordWasGuessed?: boolean;

  public language: string;

  private everyPlayerSubmittedWord$: Subject<boolean> = new Subject<boolean>();
  private userGuessedWord$: Subject<boolean> = new Subject<boolean>();
  private wrongGuessesCountReached$: Subject<boolean> = new Subject<boolean>();
  private startNextRound$: Subject<boolean> = new Subject<boolean>();
  private deleteGame$: Subject<void> = new Subject<void>();

  private readonly THINKING_TIME = 10;
  private readonly GUESSING_TIME = 15;
  private readonly ROUND_FINISHED_TIME = 10;
  private readonly WRONG_GUESS_COUNT = 3;

  constructor(
    admin: string,
    room: string,
    lang: string,
    public sendUpdateGameForAllUsers: (room: string, payload: { gameState: GameDto}) => void,
    public sendUpdateGameForUser: (clientId: string, payload: { gameState: GameDto}) => void
  ) {
    this.admin = admin;
    this.room = room;
    this.language = WordManager.supportedLanguages.includes(lang) ? lang : "de";

    this.started = false;
    this.state = GameState.NOT_STARTED;
    this.totalRounds = 3;
    this.round = 0;
    this.points = 0;
    this.users = {};
    this.wordsInRound = {};
  }

  public addUser(username: string, userId: string): void {
    this.users[username] = {
      socketId: userId,
      connected: true
    }
  }

  public startGame(): void {
    this.started = true;
    this.round = 0;
    this.points = 0;
    this.initiateNewRound();
  }

  public startNextRound(): void {
    this.startNextRound$.next(true);
  }

  public submitWordForPlayer(username: string, word: string): void {
    if (this.state !== GameState.THINKING) return;
    if (username === this.activePlayer) return;
    if (Object.values(this.wordsInRound).some(userList => userList.find(u => u === username))) return;

    // Set word for this player in this round
    if (this.wordsInRound[word]) {
      this.wordsInRound[word].push(username);
    } else {
      this.wordsInRound[word] = [username];
    }

    this.filteredWordsInRound = {};
    Object.entries(this.wordsInRound)
      .forEach(([word, userList]) =>
        userList.length > 1
          ? this.filteredWordsInRound[`<<${Object.keys(this.filteredWordsInRound).length}>>`] = userList
          : this.filteredWordsInRound[word] = userList
      );

    // Check if all connected players (except activePlayer) submitted a word -> nextState
    const everyPlayerSubmittedWord = Object.entries(this.users)
      .filter(([username, user]) => username !== this.activePlayer && user.connected)
      .every(([username]) => Object.values(this.wordsInRound).some(userList => userList.includes(username)));

    this.everyPlayerSubmittedWord$.next(everyPlayerSubmittedWord);
    // this.updateGameForUser(this.users[username].socketId, this.toDto(this.users[username].socketId));
    this.updateGameForAllUsers();
  }

  public guessWordForPlayer(username: string, word: string): void {
    if (this.state !== GameState.GUESSING) return;
    if (username !== this.activePlayer) return;

    this.guesses.push(word);
    this.guessesLeft--;

    // If word matched word to guess
    // TODO: Better word matching
    if (word.toLowerCase().trim() === this.wordToGuess.toLowerCase().trim()) {
      logInfo(`Player ${username} guessed the word in room ${this.room}`);
      this.pointsInRound = 100;
      this.points += this.pointsInRound;
      this.wordWasGuessed = true;
      this.userGuessedWord$.next(true);
    } else if (this.guesses.length === this.WRONG_GUESS_COUNT) {
      this.wrongGuessesCountReached$.next(true);
    } else {
      this.updateGameForAllUsers();
    }

  }

  private initiateNewRound(): void {
    this.activePlayer = this.getNextUser(this.activePlayer);
    this.wordToGuess = this.generateWord();
    this.round++;
    this.wordsInRound = {};
    this.state = GameState.THINKING;
    this.pointsInRound = 0;
    this.wordWasGuessed = false;
    this.totalSeconds = this.THINKING_TIME;
    this.secondsLeft = this.THINKING_TIME;
    this.updateGameForAllUsers();
    merge(this.startTimer(), this.everyPlayerSubmittedWord$).pipe(
      first(condition => condition)
    ).subscribe(
      () => this.goToGuessing()
    );
  }

  private getNextUser(activePlayer: string): string {

    if (activePlayer === undefined) return Object.keys(this.users).find(u => this.users[u].connected);

    const usernames = Object.keys(this.users);
    const userNameIndex = usernames.indexOf(activePlayer);
    let nextUsernameIndex = userNameIndex + 1;

    for (let i = 1; i < usernames.length; i++) {
      if (nextUsernameIndex >= usernames.length) {
        nextUsernameIndex = 0;
      }

      if (this.users[usernames[nextUsernameIndex]].connected) {
        return usernames[nextUsernameIndex];
      }
      nextUsernameIndex++;
    }
    logWarning("Could not find next player")
  }

  private startTimer(): Observable<boolean> {
    return interval(1000).pipe(
      takeUntil(this.deleteGame$),
      tap(() => this.secondsLeft--),
      map(() => this.secondsLeft <= 0)
    );
  }

  private goToGuessing(): void {
    this.state = GameState.GUESSING;
    this.guesses = [];
    this.guessesLeft = this.WRONG_GUESS_COUNT;
    this.totalSeconds = this.GUESSING_TIME;
    this.secondsLeft = this.GUESSING_TIME;
    this.updateGameForAllUsers();
    merge(this.startTimer(), this.userGuessedWord$, this.wrongGuessesCountReached$).pipe(
      first(condition => condition)
    ).subscribe(
      () => this.goToRoundFinished()
    );
  }

  private goToRoundFinished(): void {
    this.state = GameState.ROUND_FINISHED;
    this.totalSeconds = this.ROUND_FINISHED_TIME;
    this.secondsLeft = this.ROUND_FINISHED_TIME;
    this.updateGameForAllUsers();
    merge(this.startTimer(), this.startNextRound$).pipe(
      first(condition => condition)
    ).subscribe(
      () => {
        if (this.round < this.totalRounds) {
          this.initiateNewRound();
        } else {
          this.goToGameFinished();
        }
      }
    );
  }

  private goToGameFinished(): void {
    this.state = GameState.GAME_FINISHED;
    this.totalSeconds = undefined;
    this.secondsLeft = undefined;
    this.updateGameForAllUsers();
  }

  private generateWord(): string {
    return WordManager.getRandomWord(this.language);
  }

  public deleteGame(): void {
    this.deleteGame$.next();
    this.deleteGame$.complete();
  }

  public updateGameForAllUsers(): void {
    const gameState = this.toDto();
    Object.values(this.users).forEach((user) =>{
      this.sendUpdateGameForUser(user.socketId, this.filterGameStateForClient(user.socketId, gameState));
    });
  }

  private toDto(): GameDto {
    return {
      started: this.started,
      admin: this.admin,
      state: this.state,
      language: this.language,
      totalRounds: this.totalRounds,
      round: this.round,
      points: this.points,
      activePlayer: this.activePlayer,
      users: this.users,
      secondsLeft: this.secondsLeft,
      totalSeconds: this.totalSeconds,
      guessesLeft: this.guessesLeft,
      guesses: this.guesses,
      filteredWordsInRound: this.filteredWordsInRound,
      wordsInRound: this.wordsInRound,
      wordToGuess: this.wordToGuess,
      wordWasGuessed: this.wordWasGuessed,
      pointsInRound: this.pointsInRound,
      usersSubmittedWordInRound: [].concat.apply([], ...Object.values(this.wordsInRound)) // flatten the userlists
    }
  }

  public filterGameStateForClient(clientId: string, gameDto: GameDto): { gameState: GameDto} {

    // Do not send wordToGuess to activePlayer in Thinking and Guessing State!
    const shouldnotIncludeWordToGuess: boolean =
      (this.state === GameState.THINKING || this.state === GameState.GUESSING)
      && this.users[this.activePlayer].socketId === clientId;

    const username = Object.keys(this.users).find(u => this.users[u].socketId === clientId);

    return {
      gameState: {
        ...gameDto,
        username,
        filteredWordsInRound: this.state === GameState.GUESSING ? this.filteredWordsInRound : undefined,
        wordsInRound: this.state === GameState.ROUND_FINISHED ? this.wordsInRound : undefined,
        wordToGuess: shouldnotIncludeWordToGuess ? undefined : this.wordToGuess,
      }
    };
  }
}
