import { Game } from "../models/game";
import { UserDto } from "../../shared";

export class GameManager {
  private games: {
    [key: string]: Game;
  };

  constructor() {
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

  public removeUserFromGame(gameId: string, userId: string, username: string): void {
    const game = this.games[gameId];

    game.users[username].socketId = undefined;
    game.users[username].connected = false;

    if (Object.values(game.users).every((user) => !user.connected)) {
      // if no users left (all users disconnected), delete game
      delete this.games[gameId];
    } else if (userId === game.admin) {
      // If the admin left the game -> assign new admin
      game.admin = Object.values(game.users).find(user => user.connected).socketId;
    }
  }

  public getUsersFromGame(gameId: string): UserDto[] {
    const game = this.games[gameId];
    return Object.entries(game.users).map(([username, user]) => ({
      id: user.socketId,
      username: username,
      room: gameId,
      isAdmin: game ? user.socketId === game.admin : false
    }))
  }

  public createOrJoinGame(gameId: string, userId: string, username: string): void {
    if (!this.games[gameId]) {
      this.games[gameId] = new Game(userId, gameId);
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

  public submitWordForPlayer(gameId: string, username: string, word: string): void {
    const game = this.games[gameId];
    game.submitWordForPlayer(username, word);
  }

  public getGameState(gameId: string): { gameState: Game } {
    // TODO: We should not send private properties (wordToGuess, wordsInRound) to the clients...
    return { gameState: this.games[gameId] }
  }

  public hasGame(gameId: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.games, gameId);
  }
}
