import { GameState, RoundDto } from "shared";

export interface GameDto {
  username?: string;

  started: boolean;
  admin: string;
  state: GameState;
  language: string;

  users: {
    [username: string]: {
      socketId: string;
      connected: boolean;
    };
  };

  totalPoints: number;
  totalRounds: number;
  currentRound: number;

  round: RoundDto;
}
