import { Game } from '../models/game';
import { User } from '../models/user';

export class GameManager {
  private games: {
    [key: string]: Game;
  };

  constructor() {
    this.games = {}
  }

  public addUserToGame(gameId: string, userId: string, username: string): void {
    const game = this.games[gameId];
    // TODO: check if user already part of game
    game.users[userId] = username;
  }

  public removeUserFromGame(gameId: string, userId: string): void {
    const game = this.games[gameId];
    delete game.users[userId];

    if (Object.keys(game.users).length === 0) {
      // if no users left, delete game
      delete this.games[gameId];
    } else if (userId === game.admin) {
      // If the admin left the game -> assign new admin
      game.admin = Object.keys(game.users)[0];
    }
  }

  public getUsersFromGame(gameId: string): User[] {
    const game = this.games[gameId];
    return Object.entries(game.users).map(([userid, username]) => ({
      id: userid,
      username: username,
      room: gameId,
      isAdmin: game ? userid === game.admin : false
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

