import { Game } from "../models/game";
import { GameDto } from "../../shared";
import { WordManager } from "./word_manager";

export class GameManager {
  private games: {
    [key: string]: Game;
  };

  constructor(
    public updateGameForAllUsers: (room: string, toDto: { gameState: GameDto }) => void,
    public updateGameForUser: (clientId: string, payload: { gameState: GameDto}) => void
  ) {
    WordManager.initalizeWordLists();
    this.games = {}
  }

  public hasGame(gameId: string): boolean {
    return this.games[gameId] !== undefined;
  }

  /**
   * Adds the user to the game, ensures the usernames are unique in a room.
   * Returns a new username for the connect user, if a user with the same name is already connected to the game,
   * otherwise it is treated as "reconnect" and the socketId and connection state of the user is updated.
   * @returns the given username or newly created username if player with same username is already connected to the game
   */
  public addUserToGame(gameId: string, userId: string, username: string): string {
    const game = this.games[gameId];

    // Username does not exist in game yet, or user "reconnects"
    if (game.users[username] === undefined || !game.users[username].connected) {
      game.addUser(username, userId);
      return username
    }

    // Connected user with same user same is already connected, change username of newly connected user
    const newUsername = this.getUnusedUsername(Object.keys(game.users), username);
    game.addUser(newUsername, userId);
    return newUsername;
  }

  /**
   * Sets the user to disconnected. If all users are disconnected from game, the game is also deleted.
   * If admin disconneced, a new admin is assigned.
   * @returns true if the game was deleted
   */
  public disconnectUserFromGame(gameId: string, userId: string, username: string): boolean {
    const game = this.games[gameId];

    game.removeUser(username);

    if (game.areAllUsersDisconnected()) {
      // if no users left (all users disconnected), delete game
      game.deleteGame();
      delete this.games[gameId];
      return true;
    }

    // If the admin left the game -> assign new admin
    if (game.isUserAdmin(userId)) {
      game.admin = Object.values(game.users).find(user => user.connected).socketId;
    }

    if (game.getNumberOfConnectedPlayers() < 3) game.pause();

    return false;
  }

  /**
   * Creates a new game if it does net exist yet, and adds the user to the game.
   * @returns the username under which the user is connected to the game (no duplicated allowed)
   */
  public createOrJoinGame(gameId: string, userId: string, username: string, lang = "de"): string {
    if (!this.hasGame(gameId)) {
      this.games[gameId] = new Game(userId, gameId, lang, this.updateGameForAllUsers, this.updateGameForUser);
    }
    return this.addUserToGame(gameId, userId, username);
  }

  public startGame(gameId: string, clientId: string): void {
    const game = this.games[gameId];
    if (!game.isUserAdmin(clientId)) throw Error("Unauthorized request");

    if (game.getNumberOfConnectedPlayers() < 3) throw Error("Min 3 connected players required to start game");

    game.startGame();
  }

  public pauseGame(gameId: string, clientId: string): void {
    const game = this.games[gameId];
    if (game.isUserAdmin(clientId)) {
      game.pause();
    } else {
      throw Error();
    }
  }

  public unpauseGame(gameId: string, clientId: string): void {
    const game = this.games[gameId];
    if (game.isUserAdmin(clientId)) {
      game.unpause();
    } else {
      throw Error();
    }
  }

  public startNextRound(gameId: string, username: string): void {
    const game = this.games[gameId];
    if (game.round.activePlayer === username) {
      game.startNextRound();
    } else {
      throw Error();
    }
  }

  public submitWordSelection(gameId: string, username: string, selection: string): void {
    const game = this.games[gameId];
    try {
      game.submitWordSelection(username, parseInt(selection));
    } catch {
      throw Error("Wrongly formatted data!");
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

  public sendGameUpdate(gameId: string): void {
    this.games[gameId].updateGameForAllUsers();
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
}
