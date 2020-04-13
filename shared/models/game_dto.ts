import { GameState } from "shared";

export interface GameDto {
  started: boolean;
  admin: string;
  state: GameState;

  totalRounds: number;
  round: number ;
  points: number;
  activePlayer: string;
  secondsLeft: number;
  totalSeconds: number;

  users: {
    [username: string]: {
      socketId: string;
      connected: boolean;
    };
  };
}
