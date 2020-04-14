import { Game } from "../models/game";
import { GameDto } from "../../shared";

export class GameManager {
  private games: {
    [key: string]: Game;
  };

  constructor(
    public updateGameForAllUsers: (room: string, toDto: (clientId: string) => { gameState: GameDto }) => void,
    public updateGameForUser: (clientId: string, payload: { gameState: GameDto}) => void
  ) {
    this.games = {}
  }

  public addUserToGame(gameId: string, userId: string, username: string): void {
    const game = this.games[gameId];
    if (game.users[username] === undefined) {
      game.users[username] = {
        socketId: userId,
        connected: true
      };
    }
    if (game.users[username].connected) {
      // TODO: User with same name already connected!
    } else {
      game.users[username].socketId = userId;
      game.users[username].connected = true
    }
  }

  public disconnectUserFromGame(gameId: string, userId: string, username: string): void {
    const game = this.games[gameId];

    game.users[username].socketId = undefined;
    game.users[username].connected = false;

    if (Object.values(game.users).every((user) => !user.connected)) {
      // if no users left (all users disconnected), delete game
      if (this.hasGame(gameId)) {
        this.games[gameId].deleteGame();
        delete this.games[gameId];
      }
    } else if (userId === game.admin) {
      // If the admin left the game -> assign new admin
      game.admin = Object.values(game.users).find(user => user.connected).socketId;
    }
  }

  public createOrJoinGame(gameId: string, userId: string, username: string): void {
    if (!this.games[gameId]) {
      this.games[gameId] = new Game(userId, gameId, this.updateGameForAllUsers, this.updateGameForUser);
    }
    this.addUserToGame(gameId, userId, username);
  }

  public startGame(gameId: string, clientId: string): void {
    const game = this.games[gameId];
    if (game.admin === clientId) {
      game.startGame();
    } else {
      throw Error();
    }
  }

  public startNextRound(gameId: string, username: string): void {
    const game = this.games[gameId];
    if (game.activePlayer === username) {
      game.startNextRound();
    } else {
      throw Error();
    }
  }

  public submitWordForPlayer(gameId: string, username: string, word: string): void {
    const game = this.games[gameId];
    game.submitWordForPlayer(username, word);
  }

  public guessWordForPlayer(gameId: string, username: string, word: string): void {
    const game = this.games[gameId];
    game.guessWordForPlayer(username, word);
  }

  public getGameState(gameId: string, clientid: string): { gameState: GameDto } {
    // TODO: We should not send private properties (wordToGuess, wordsInRound) to the clients...
    return this.games[gameId].toDto(clientid);
  }

  public hasGame(gameId: string): boolean {
    return this.games[gameId] !== undefined;
  }
}