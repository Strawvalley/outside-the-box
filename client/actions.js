import { fromEvent, merge } from "rxjs";

const initiateButton = document.querySelector('#initiate');
const restartButton = document.querySelector('#restart');

const initiateButtonClick$ = fromEvent(initiateButton, 'click');
const restartButtonButtonClick$ = fromEvent(restartButton, 'click');

const initiateGame$ = merge(initiateButtonClick$, restartButtonButtonClick$);

export default initiateGame$