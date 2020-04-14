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

  /**
   * Adds the user to the game, ensures the usernames are unique in a room.
   * Returns a new username for the connect user, if a user with the same name is already connected to the game,
   * otherwise it is treated as "reconnect" and the socketId and connection state of the user is updated.
   * @returns the given username or newly created username if player with same username is already connected to the game
   */
  public addUserToGame(gameId: string, userId: string, username: string): string {
    const game = this.games[gameId];

    // Username does not exist in game yet
    if (game.users[username] === undefined) {
      game.users[username] = {
        socketId: userId,
        connected: true
      };
      return username
    }

    // Username does already exist in game,
    // check if it is a "reconnect" or create and return a new username for the connected user
    if (!game.users[username].connected) {
      game.users[username].socketId = userId;
      game.users[username].connected = true
      return username;
    } else {
      const newUsername = this.getUnusedUsername(Object.keys(game.users), username);
      game.users[newUsername] = {
        socketId: userId,
        connected: true
      };
      return newUsername;
    }
  }

  private getUnusedUsername(usersInRoom: string[], username: string): string {
    const randomNum = Math.floor(Math.random() * 1000);
    const newUsername = `${username}_${randomNum}`;
    if (usersInRoom.includes(newUsername)) {
      return this.getUnusedUsername(usersInRoom, newUsername);
    } else {
      return newUsername;
    }
  }

  /**
   * Sets the user to disconnected. If all users are disconnected from game, the game is also deleted.
   * If admin disconneced, a new admin is assigned.
   * @returns true if the game was deleted
   */
  public disconnectUserFromGame(gameId: string, userId: string, username: string): boolean {
    const game = this.games[gameId];

    game.users[username].socketId = undefined;
    game.users[username].connected = false;

    if (Object.values(game.users).every((user) => !user.connected)) {
      // if no users left (all users disconnected), delete game
      if (this.hasGame(gameId)) {
        this.games[gameId].deleteGame();
        delete this.games[gameId];
        return true;
      }
    } else if (userId === game.admin) {
      // If the admin left the game -> assign new admin
      game.admin = Object.values(game.users).find(user => user.connected).socketId;
    }
    return false;
  }

  /**
   * Creates a new game if it does net exist yet, and adds the user to the game.
   * @returns the username under which the user is connected to the game (no duplicated allowed)
   */
  public createOrJoinGame(gameId: string, userId: string, username: string): string {
    if (!this.games[gameId]) {
      this.games[gameId] = new Game(userId, gameId, this.updateGameForAllUsers, this.updateGameForUser);
    }
    return this.addUserToGame(gameId, userId, username);
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
