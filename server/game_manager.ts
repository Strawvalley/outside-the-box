import { Game } from "./models/game";

export class GameManager {
  private games: {
    [key: string]: Game
  };

  constructor() {
    this.games = {}
  }

  public addUserToGame(gameId: string, userId: string, username: string) {
    const game = this.games[gameId];
    // TODO: check if user already part of game
    game.users[userId] = username;
  }

  public removeUserFromGame(gameId: string, userId: string) {
    const game = this.games[gameId];
    // game.users = game.users.filter(u => u !== username);
    delete game.users[userId];

    if (Object.keys(game.users).length === 0) {
      // if no users left, delete game
      delete this.games[gameId];
    } else if (userId === game.admin) {
      // If the admin left the game -> assign new admin
      game.admin = Object.keys(game.users)[0];
    }
  }

  public getUsersFromGame(gameId: string) {
    const game = this.games[gameId];
    return Object.entries(game.users).map(([userid, username]) => ({
      userid,
      username: username,
      room: gameId,
      isAdmin: game ? userid === game.admin : false
    }))
  }

  public createOrJoinGame(gameId: string, userId: string, username: string) {
    if (!this.games[gameId]) {
      this.games[gameId] = new Game(userId, gameId);
    } 
    this.addUserToGame(gameId, userId, username);
  }

  public startGame(gameId: string, clientId: string) {
    const game = this.games[gameId];
    if (game.admin === clientId) {
      game.startGame();
    } else {
      throw Error();
    }
  }

  public submitWordForPlayer(gameId: string, username: string, word: string) {
    const game = this.games[gameId];
    game.submitWordForPlayer(username, word);
  }
  
  public getGameState(gameId: string): Object {
    return { gameState: this.games[gameId] }
  }

  public isGameRunning(gameId: string) {
    return this.games.hasOwnProperty(gameId);
  }
}

