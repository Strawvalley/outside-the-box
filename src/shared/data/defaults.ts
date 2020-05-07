import { datasets } from "./datasets";

export const defaults = Object.freeze({
  dataset: { default: datasets[0].key },
  guessingTime: { default: 60, min: 15, max: 120, increments: 15 },
  totalRounds: { default: 3, min: 1, max: 10, increments: 1 }
})

export const generateGameConfigDefaults = () => Object.entries(defaults).reduce((acc, [key,val]) => {
	return ({...acc, [key]: val.default});
}, {});