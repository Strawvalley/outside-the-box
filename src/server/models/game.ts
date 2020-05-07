import { GameState, GameDto, RoundDto, GameConfig, defaults, UpdateTrigger, datasets } from "../../shared";
import { Subject, merge, interval, Observable } from "rxjs";
import { tap, map, first, takeUntil, filter, take } from "rxjs/operators";
import { logInfo, logWarning } from "../managers/log_manager";
import { WordManager } from "../managers/word_manager";

export class Game {

  started: boolean;
  paused: boolean;
  admin: string;
  room: string;
  state: GameState;
  dataset: string;

  totalRounds: number;
  totalPoints: number;
  currentRound: number;

  users: {
    [username: string]: {
      socketId: string;
      connected: boolean;
    };
  };

  round: RoundDto;

  private userSubmittedWordSelection$: Subject<[UpdateTrigger, string]> = new Subject<[UpdateTrigger, string]>();
  private everyPlayerSubmittedWord$: Subject<[UpdateTrigger, string]> = new Subject<[UpdateTrigger, string]>();
  private userGuessedWord$: Subject<[UpdateTrigger, string]> = new Subject<[UpdateTrigger, string]>();
  private wrongGuessesCountReached$: Subject<[UpdateTrigger, string]> = new Subject<[UpdateTrigger, string]>();
  private startNextRound$: Subject<[UpdateTrigger, string]> = new Subject<[UpdateTrigger, string]>();
  private deleteGame$: Subject<void> = new Subject<void>();

  private readonly SELECTION_TIME = 20;
  private readonly THINKING_TIME = 35;
  private readonly ROUND_FINISHED_TIME = 10;
  private readonly WRONG_GUESS_COUNT = 5;
  private readonly COUNT_WORDS_SELECTION = 3;

  private guessingTime: number;

  constructor(
    admin: string,
    room: string,
    lang: string,
    public sendUpdateGameForAllUsers: (room: string, payload: { gameState: GameDto }) => void,
    public sendUpdateGameForUser: (clientId: string, payload: { gameState: GameDto }) => void
  ) {
    this.admin = admin;
    this.room = room;
    this.dataset = datasets[0].key;

    this.paused = false;
    this.started = false;
    this.state = GameState.NOT_STARTED;
    this.totalRounds = defaults.totalRounds.default;
    this.currentRound = 1;
    this.totalPoints = 0;
    this.users = {};
    this.round = {};

    this.guessingTime = defaults.guessingTime.default;
  }

  public addUser(username: string, userId: string): void {
    this.users[username] = {
      socketId: userId,
      connected: true
    }
  }

  public removeUser(username: string): void {
    this.users[username].socketId = undefined;
    this.users[username].connected = false;
  }

  public areAllUsersDisconnected(): boolean {
    return Object.values(this.users).every((user) => !user.connected);
  }

  public getNumberOfConnectedPlayers(): number {
    return Object.values(this.users).filter(u => u.connected).length;
  }

  public isUserAdmin(userId: string): boolean {
    return this.admin === userId;
  }

  public configureGame(gameConfig: GameConfig): void {
    this.dataset = datasets.findIndex(dataset => dataset.key === gameConfig.dataset) > -1 ? gameConfig.dataset : datasets[0].key;
    this.guessingTime = this.valueInRange(gameConfig.guessingTime, defaults.guessingTime) ? gameConfig.guessingTime : defaults.guessingTime.default;
    this.totalRounds = this.valueInRange(gameConfig.totalRounds, defaults.totalRounds) ? gameConfig.totalRounds : defaults.totalRounds.default;
  }

  private valueInRange(value: number, range: {min: number; max: number}): boolean {
    return value >= range.min && value <= range.max;
  }

  public startGame(): void {
    this.started = true;
    this.currentRound = 1;
    this.totalPoints = 0;
    this.round = {};
    this.initiateNewRound();
  }

  public pause(): void {
    this.paused = true;
    this.updateGameForAllUsers(UpdateTrigger.PAUSED_GAME);
  }

  public unpause(): void {
    this.paused = false;
    this.updateGameForAllUsers(UpdateTrigger.UNPAUSED_GAME);
  }

  public startNextRound(): void {
    this.startNextRound$.next([UpdateTrigger.INITIATED_NEW_ROUND, null]);
  }

  public deleteGame(): void {
    this.deleteGame$.next();
    this.deleteGame$.complete();
  }

  public updateGameForAllUsers(updateTriger?: UpdateTrigger, updateTriggeredBy?: string): void {
    const gameState = this.toDto(updateTriger, updateTriggeredBy);
    Object.values(this.users).forEach((user) => {
      this.sendUpdateGameForUser(user.socketId, this.filterGameStateForClient(user.socketId, gameState));
    });
  }

  public submitWordSelection(username: string, selection: number): void {
    if (this.state !== GameState.SELECTING) return;
    if (username !== this.round.activePlayer) return;
    if (selection < 0 || selection > this.COUNT_WORDS_SELECTION - 1) return;

    this.round.wordToGuess = this.sanitizeWord(this.round.wordsForSelection[selection]);

    this.userSubmittedWordSelection$.next([UpdateTrigger.USER_SELECTED_WORD, username]);
  }

  public submitWordForPlayer(username: string, word: string): void {
    if (this.state !== GameState.THINKING) return;
    if (username === this.round.activePlayer) return;
    if (Object.values(this.round.wordsInRound).some(userList => userList.find(u => u === username))) return;

    const sanitizedWord = this.sanitizeWord(word);
    if (/\s/g.test(sanitizedWord)) return; // check if whitespace present

    // Set word for this player in this round
    if (this.round.wordsInRound[sanitizedWord]) {
      this.round.wordsInRound[sanitizedWord].push(username);
    } else {
      this.round.wordsInRound[sanitizedWord] = [username];
    }

    // Check if all connected players (except activePlayer) submitted a word -> nextState
    const everyPlayerSubmittedWord = Object.entries(this.users)
      .filter(([username, user]) => username !== this.round.activePlayer && user.connected)
      .every(([username]) => Object.values(this.round.wordsInRound).some(userList => userList.includes(username)));

    if (everyPlayerSubmittedWord) {
      this.everyPlayerSubmittedWord$.next([UpdateTrigger.ALL_USERS_SUBMITTED_WORD, username]);
    } else {
      this.updateGameForAllUsers(UpdateTrigger.USER_SUBMITTED_WORD, username);
    }
  }

  private sanitizeWord(word: string): string {
    const sanitizedWord = word.toLowerCase().trim();
    return sanitizedWord;
  }

  public guessWordForPlayer(username: string, word: string): void {
    if (this.state !== GameState.GUESSING) return;
    if (username !== this.round.activePlayer) return;
    const sanitizedWord = this.sanitizeWord(word);

    this.round.guesses.push(sanitizedWord);
    this.round.guessesLeft--;

    if (sanitizedWord === this.round.wordToGuess) {
      logInfo(`Player ${username} guessed the word in room ${this.room}`);
      this.round.pointsInRound = this.getPointsForRound();
      this.round.wordWasGuessed = true;
      this.totalPoints += this.round.pointsInRound;
      this.userGuessedWord$.next([UpdateTrigger.USER_GUESSED_WORD, username]);
    } else if (this.round.guesses.length === this.WRONG_GUESS_COUNT) {
      this.wrongGuessesCountReached$.next([UpdateTrigger.USER_USED_ALL_GUESSES, username]);
    } else {
      this.updateGameForAllUsers(UpdateTrigger.USER_SUBMITTED_GUESS, username);
    }
  }

  private getPointsForRound(): number {
    let basePoints = 50;
    // bonus points for secondsLeft, include totalSeconds so longer round do not produce more points
    basePoints *= (this.round.secondsLeft / this.round.totalSeconds) + 1.0;

    // bonus points for guessesLeft (range 0 to 4)
    basePoints *= (this.round.guessesLeft * 0.125) + 1.0;

    // bonus points for distinct words
    const onlyDistinctWords = this.round.filteredWordsInRound.every((entry) => entry.word !== undefined);
    if (onlyDistinctWords) basePoints *= 2.0;

    return Math.round(basePoints);
  }

  private initiateNewRound(): void {
    this.state = GameState.SELECTING;
    this.round = this.getNewRound();
    const timer = this.startTimer(this.SELECTION_TIME);
    this.updateGameForAllUsers(UpdateTrigger.INITIATED_NEW_ROUND);
    merge(timer, this.userSubmittedWordSelection$).pipe(
      take(1)
    ).subscribe(
      (data) => {
        // if timer has run out, select first word
        this.round.wordToGuess = this.round.wordToGuess || this.round.wordsForSelection[0]
        this.goToThinking(data[0], data[1]);
      }
    );
  }

  private goToThinking(updateTrigger: UpdateTrigger, updateTriggeredBy: string): void {
    this.state = GameState.THINKING;
    merge(this.startTimer(this.THINKING_TIME), this.everyPlayerSubmittedWord$).pipe(
      take(1)
    ).subscribe(
      (data) => this.goToGuessing(data[0], data[1])
    );
    this.updateGameForAllUsers(updateTrigger, updateTriggeredBy);
  }

  private getNextUser(activePlayer: string): string {

    if (activePlayer === undefined) return Object.keys(this.users).find(u => this.users[u].connected);

    const usernames = Object.keys(this.users);
    const userNameIndex = usernames.indexOf(activePlayer);
    let nextUsernameIndex = userNameIndex + 1;

    for (let i = 1; i < usernames.length; i++) {
      if (nextUsernameIndex >= usernames.length) {
        nextUsernameIndex = 0;
        this.currentRound++;
      }

      if (this.users[usernames[nextUsernameIndex]].connected) {
        return usernames[nextUsernameIndex];
      }
      nextUsernameIndex++;
    }
    logWarning("Could not find next player");
  }

  private startTimer(seconds: number): Observable<[UpdateTrigger, string]> {
    this.round.totalSeconds = seconds;
    this.round.secondsLeft = seconds;
    return interval(1000).pipe(
      takeUntil(this.deleteGame$),
      filter(() => !this.paused),
      tap(() => this.round.secondsLeft--),
      filter(() => this.round.secondsLeft < 0),
      map(() => [UpdateTrigger.TIME_RAN_OUT, null])
    );
  }

  private goToGuessing(updateTrigger: UpdateTrigger, updateTriggeredBy: string): void {
    this.state = GameState.GUESSING;
    this.filterWordsInRound();
    const timer = this.startTimer(this.guessingTime);
    this.updateGameForAllUsers(updateTrigger, updateTriggeredBy);
    merge(timer, this.userGuessedWord$, this.wrongGuessesCountReached$).pipe(
      take(1)
    ).subscribe(
      (data) => {
        this.goToRoundFinished(data[0], data[1]);
      }
    );
  }

  private filterWordsInRound(): void {
    Object.entries(this.round.wordsInRound)
      .forEach(([word, userList]) =>
        userList.length > 1
          ? this.round.filteredWordsInRound.push({ users: userList, word: undefined })
          : this.round.filteredWordsInRound.push({ users: userList, word: word })
      );
  }

  private goToRoundFinished(updateTrigger: UpdateTrigger, updateTriggeredBy: string): void {
    this.state = GameState.ROUND_FINISHED;
    const timer = this.startTimer(this.ROUND_FINISHED_TIME);
    this.updateGameForAllUsers(updateTrigger, updateTriggeredBy);
    merge(timer, this.startNextRound$).pipe(
      take(1)
    ).subscribe(
      () => {
        if (this.isGameFinished()) {
          this.goToGameFinished();
        } else {
          this.initiateNewRound();
        }
      }
    );
  }

  private isGameFinished(): boolean {
    const usernames = Object.keys(this.users);
    const isLastPlayer = usernames.indexOf(this.round.activePlayer) === usernames.length - 1;
    return isLastPlayer && this.currentRound === this.totalRounds;
  }

  private goToGameFinished(): void {
    this.state = GameState.GAME_FINISHED;
    this.round.totalSeconds = undefined;
    this.round.secondsLeft = undefined;
    this.updateGameForAllUsers(UpdateTrigger.FINISHED_GAME);
  }

  private generateWord(): string {
    return WordManager.getRandomWord(this.dataset).toLowerCase();
  }

  private generateWordsForSelection(count: number): string[] {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(this.generateWord());
    }
    return words;
  }

  private getNewRound(): RoundDto {
    return {
      activePlayer: this.getNextUser(this.round.activePlayer),
      wordsForSelection: this.generateWordsForSelection(this.COUNT_WORDS_SELECTION),
      wordToGuess: undefined,
      wordsInRound: {},
      filteredWordsInRound: [],
      pointsInRound: 0,
      wordWasGuessed: false,
      guesses: [],
      guessesLeft: this.WRONG_GUESS_COUNT,
      usersSubmittedWordInRound: [],
      submittedWordByUser: undefined
    }
  }

  private toDto(updateTrigger?: UpdateTrigger, updateTriggeredBy?: string): GameDto {
    return {
      room: this.room,
      started: this.started,
      paused: this.paused,
      admin: this.admin,
      state: this.state,
      dataset: this.dataset,
      totalRounds: this.totalRounds,
      currentRound: this.currentRound,
      totalPoints: this.totalPoints,
      users: this.users,
      round: {
        totalSeconds: this.round.totalSeconds,
        secondsLeft: this.round.secondsLeft,
        activePlayer: this.round.activePlayer,
        guessesLeft: this.round.guessesLeft,
        guesses: this.round.guesses,
        wordsForSelection: this.round.wordsForSelection,
        filteredWordsInRound: this.round.filteredWordsInRound,
        wordsInRound: this.round.wordsInRound,
        wordToGuess: this.round.wordToGuess,
        wordWasGuessed: this.round.wordWasGuessed,
        pointsInRound: this.round.pointsInRound,
        usersSubmittedWordInRound: this.round.wordsInRound ? [].concat(...Object.values(this.round.wordsInRound)) : [] // flatten userlists
      },
      updateTrigger: updateTrigger,
      updateTriggeredBy: updateTriggeredBy
    }
  }

  private filterGameStateForClient(clientId: string, gameDto: GameDto): { gameState: GameDto } {
    // Do not send wordsForSelection to activePlayer
    const includeWordsForSelection: boolean =
      this.state === GameState.SELECTING
      && this.users[this.round.activePlayer].socketId !== clientId;

    // Do not send wordToGuess to activePlayer in Thinking and Guessing State!
    const shouldnotIncludeWordToGuess: boolean =
      (this.state === GameState.THINKING || this.state === GameState.GUESSING)
      && this.users[this.round.activePlayer].socketId === clientId;

    const username = Object.keys(this.users).find(u => this.users[u].socketId === clientId);

    const submittedWordbyUser = this.round.wordsInRound
      ? Object.keys(this.round.wordsInRound).find(word => this.round.wordsInRound[word].includes(username))
      : undefined;

    return {
      gameState: {
        ...gameDto,
        username,
        round: {
          ...gameDto.round,
          wordsForSelection: includeWordsForSelection ? this.round.wordsForSelection : undefined,
          filteredWordsInRound: this.state === GameState.GUESSING ? this.round.filteredWordsInRound : undefined,
          wordsInRound: this.state === GameState.ROUND_FINISHED ? this.round.wordsInRound : undefined,
          wordToGuess: shouldnotIncludeWordToGuess ? undefined : this.round.wordToGuess,
          submittedWordByUser: submittedWordbyUser
        }
      }
    };
  }
}
