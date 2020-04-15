import { GameState } from "shared";

export interface GameDto {
  started: boolean;
  admin: string;
  state: GameState;
  language: string;

  totalRounds: number;
  round: number ;
  points: number;
  activePlayer: string;

  username?: string;

  secondsLeft?: number;
  totalSeconds?: number;
  guessesLeft?: number;
  guesses?: string[];
  wordToGuess?: string;
  pointsInRound?: number;
  wordWasGuessed?: boolean;

  wordsInRound?: {
    [word: string]: string[];
  };

  filteredWordsInRound?: {
    [word: string]: string[];
  };

  users: {
    [username: string]: {
      socketId: string;
      connected: boolean;
    };
  };

  usersSubmittedWordInRound?: string[];
}
