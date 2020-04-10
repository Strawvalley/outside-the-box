import { fromEvent } from "rxjs";

const initiateButton = document.querySelector('#initiate');

const initiateButtonClick$ = fromEvent(initiateButton, 'click');

const initiateGame$ = initiateButtonClick$;

export default initiateGame$