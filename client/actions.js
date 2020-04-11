import { fromEvent, merge, of } from "rxjs";
import { switchMap } from "rxjs/operators";

const initiateButton = document.querySelector('#initiate');
const restartButton = document.querySelector('#restart');

const initiateButtonClick$ = fromEvent(initiateButton, 'click');
const restartButtonButtonClick$ = fromEvent(restartButton, 'click');

const initiateGame$ = merge(initiateButtonClick$, restartButtonButtonClick$);

const thinkingButton = document.querySelector('#thinking');
const thinkingInput = document.querySelector('#thinking-word');

const submitThinkingWord$ = fromEvent(thinkingButton, 'click').pipe(
  switchMap(() => of(thinkingInput.value))
)

export {
  initiateGame$,
  submitThinkingWord$
}