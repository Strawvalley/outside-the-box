import { GameState } from "shared";

export interface GameDto {
  started: boolean;
  admin: string;
  state: GameState;

  totalRounds: number;
  round: number ;
  points: number;
  activePlayer: string;

  secondsLeft?: number;
  totalSeconds?: number;
  guessesLeft?: number;
  guesses?: string[];
  wordToGuess?: string;
  pointsInRound?: number;
  wordWasGuessed?: boolean;

  wordsInRound?: {
    [username: string]: string;
  };

  filteredWordsInRound?: {
    [username: string]: string;
  };

  users: {
    [username: string]: {
      socketId: string;
      connected: boolean;
    };
  };
}
