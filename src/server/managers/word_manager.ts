import fs from 'fs';
import { logWarning, logInfo } from './log_manager';
import { datasets } from '../../shared';

export class WordManager {
  
  private static wordLists: {
    [datasetKey: string]: string[];
  } = {};

  public static initalizeWordLists(): void {
    logInfo("Initalize word lists");
    datasets.forEach((dataset) => {
      fs.readFile(`word_lists/${dataset.file}`, (err, data) => {
        if (err) logWarning(`Could not read file ${dataset.file}`);
        logInfo(`Word list loaded: ${dataset.key}`);
        WordManager.wordLists[dataset.key] = data.toString().split("\n").map(word => word.replace('\r','').trim());
      });
    });
  }

  public static getRandomWord(lang: string): string {
    return this.wordLists[lang][Math.floor(Math.random() * this.wordLists[lang].length)];
  }

}
