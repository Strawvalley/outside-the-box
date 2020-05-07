import { GameState, RoundDto, UpdateTrigger } from "shared";

export interface GameDto {
  username?: string;
  room?: string;

  started: boolean;
  admin: string;
  state: GameState;
  dataset: string;
  paused: boolean;

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
  updateTrigger?: UpdateTrigger;
  updateTriggeredBy?: string;
}
