import { fromEvent, merge, of } from "rxjs";
import { switchMap } from "rxjs/operators";

const initiateButton = document.querySelector<HTMLButtonElement>('#initiate');
const restartButton = document.querySelector<HTMLButtonElement>('#restart');

const initiateButtonClick$ = fromEvent(initiateButton, 'click');
const restartButtonButtonClick$ = fromEvent(restartButton, 'click');

const initiateGame$ = merge(initiateButtonClick$, restartButtonButtonClick$);

const thinkingButton = document.querySelector<HTMLButtonElement>('#thinking');
const thinkingInput = document.querySelector<HTMLInputElement>('#thinking-word');

const submitThinkingWord$ = fromEvent(thinkingButton, 'click').pipe(
  switchMap(() => of(thinkingInput.value))
);

const guessingButton = document.querySelector<HTMLButtonElement>('#guessing');
const guessingInput = document.querySelector<HTMLInputElement>('#guessing-word');

const submitGuessingWord$ = fromEvent(guessingButton, 'click').pipe(
  switchMap(() => of(guessingInput.value))
);

const nextRoundButton = document.querySelector<HTMLButtonElement>('#next-round');
const startNextRound$ = fromEvent(nextRoundButton, 'click');

const pauseGameButton = document.querySelector<HTMLButtonElement>('#pause-game');
const pauseGame$ = fromEvent(pauseGameButton, 'click');

const unpauseGameButton = document.querySelector<HTMLButtonElement>('#unpause-game');
const unpauseGame$ = fromEvent(unpauseGameButton, 'click');

export {
  initiateGame$,
  submitThinkingWord$,
  submitGuessingWord$,
  startNextRound$,
  pauseGame$,
  unpauseGame$,
}
