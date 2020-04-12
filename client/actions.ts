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
)

export {
  initiateGame$,
  submitThinkingWord$
}