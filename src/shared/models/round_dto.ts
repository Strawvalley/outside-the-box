export interface RoundDto {
  activePlayer?: string;
  secondsLeft?: number;
  totalSeconds?: number;
  guessesLeft?: number;
  guesses?: string[];
  wordsForSelection?: string[];
  wordToGuess?: string;
  pointsInRound?: number;
  wordWasGuessed?: boolean;
  wordsInRound?: {
    [word: string]: string[];
  };
  filteredWordsInRound?: {
    [word: string]: string[];
  };
  usersSubmittedWordInRound?: string[];
}