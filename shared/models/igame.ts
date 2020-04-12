import { GameState } from "shared/enums/game_state";

export interface IGame {
  started: boolean;
  admin: string;
  state: GameState;

  totalRounds: number;
  round: number ;
  points: number;
  activePlayer: string;

  users: {
    [userId: string]: string
  }
}