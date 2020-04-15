import fs from 'fs';
import { logWarning, logInfo } from './log_manager';

export class WordManager {

  public static readonly supportedLanguages = ["de", "en"];

  private static wordLists: {
    [languageKey: string]: string[];
  } = {};

  public static initalizeWordLists(): void {
    logInfo("Initalize word lists");
    this.supportedLanguages.forEach((lang) => {
      fs.readFile(`word_lists/${lang}.txt`, (err, data) => {
        if (err) logWarning(`Could not read file ${lang}.txt`);
        logInfo(`Word list loaded: ${lang}`);
        WordManager.wordLists[lang] = data.toString().split("\n");
      });
    });
  }

  public static getRandomWord(lang: string): string {
    return this.wordLists[lang][Math.floor(Math.random() * this.wordLists[lang].length)];
  }

}
