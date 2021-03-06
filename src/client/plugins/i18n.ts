import Vue from 'vue';
import VueI18n from 'vue-i18n';

const messages = {
  'en': {
    roomEnterUsername: `Please enter your username`,
    roomAnd: `and`,
    roomOr: `or`,
    roomButtonCreateGame: `Create Game`,
    roomButtonJoinGame: `Join Game`,
    roomInstructionTitle: `How the game works`,
    roomInstructionParagraph1: `One player is chosen to be the {0} for the round.`,
    roomInstructionParagraph1Guesser: `guesser`,
    roomInstructionParagraph2: `All other players are presented the word for this round and have to come up with a {0} for the guesser. The hint can only be a single word!`,
    roomInstructionParagraph2Hint: `hint`,
    roomInstructionParagraph3: `As soon as all players have submitted their hints, the guesser has to {0} for this round.`,
    roomInstructionParagraph3FigureWord: `figure out the word`,
    roomInstructionParagraph4: `But there is a {0}! Hints have to be {1}. As soon as two or more players submit the same hint, it can not help the guesser to find the word! So think {2} to make sure the guesser will find the word!`,
    roomInstructionParagraph4Twist: `twist`,
    roomInstructionParagraph4Unique: `unique`,
    roomInstructionParagraph4OutsideTheBox: `outside the box`,
    gameButtonPauseGame: `Pause game`,
    gameButtonLeaveGame: `Leave game`,
    gameUsername: `Username`,
    gameRoom: `Room`,
    gamePoints: `Points`,
    gameRound: `Round`,
    notStartedTitle: `Not Started`,
    notStartedHintText1: `You need at least 3 players to start the game!`,
    notStartedButtonStartGame: `Start game`,
    notStartedHintText2: `Wait for admin to start the game!`,
    notStartedConfigGuessingTime: `Guessing Time`,
    notStartedConfigNumRounds: `Number of Rounds`,
    notStartedConfigDataset: `Dataset`,
    notStartedConfigure: `Configure game`,
    selectingTitle: `Select a word`,
    selectingButtonWordSelect: `Word {0}`,
    selectingHintText1: ` is selecting a number.`,
    selectingHintText2: `Words behind the numbers:`,
    thinkingTitle: `Submit Hints`,
    thinkingHintText1: `The word in this round is: `,
    thinkingHintText2: `You submitted {submittedWordByUser} for this round!`,
    thinkingHintText3: `Wait for other players to submit their words.`,
    thinkingHintText4: ` No one else submitted a word yet. | has already submitted a hint. | have already submitted hints.`,
    thinkingErrorEmptyWord: `Hint cannot be empty!`,
    thinkingErrorHintEqualGuess: `Cannot choose word to guess as hint!`,
    thinkingErrorMultipleWords: `Hints can only be one word!`,
    thinkingButtonSubmitWord: `Submit word`,
    guessingTitle: `Guess the word`,
    guessingHintText1: `is guessing the word.`,
    guessingHintText2: `The word in this round is: `,
    guessingHintsTitle: `Hints:`,
    guessingHintsSameWord: ` had the same idea`,
    guessingYouHave: `You have`,
    guessingGuessesLeft: `guesses left.`,
    guessingButtonSubmit: `Guess word`,
    guessingHas: `has`,
    guessingGuessesSoFar: `Guesses so far:`,
    guessingErrorEmptyWord: `Guess cannot be empty!`,
    guessingCloseToSolution1: `You are close to the solution!`,
    guessingCloseToSolution2: `is close to the solution!`,
    roundFinishedTitle: `Round finished`,
    roundFinishedWordWas: `The word to guess was:`,
    roundFinishedGuesses: `Guesses: `,
    roundFinishedPoints: `Points`,
    roundFinishedButtonStartNextRound: `Start next round`,
    roundFinishedButtonFinishGame: `Finish game`,
    gameFinishedTitle: `Game finished`,
    gameFinishedTotalPoints: `Total Points:`,
    gameFinishedHintText1: `There are min 3 playsers required to start a new game.`,
    gameFinishedButtonStartGame: `Start new game`,
    gameFinishedHintText2: `Wait for the admin to start a new game!`,
    pauseTitle: `Game paused!`,
    pauseHintText1: `At least 3 players have to be connected!`,
    pauseButtonUnpauseGame: `Unpause game`,
    pauseHintText2: `Please wait for the admin to unpause the game`,
    userlistTitle: `Users`,
    userlistDisconnected: `disconnected`,
    userlistAdmin: `Admin`,
    userlistActivePlayer: `Guesser`,
    userListYou: `(You)`,
    invitationLinkCopied: `Invitation link copied`
  },
  'de': {
    roomEnterUsername: `Bitte gebe deinen Benutzernamen ein`,
    roomAnd: `und`,
    roomOr: `oder`,
    roomButtonCreateGame: `Spiel erstellen`,
    roomButtonJoinGame: `Spiel beitreten`,
    roomInstructionTitle: `Wie das Spiel funktioniert`,
    roomInstructionParagraph1: `Ein Spieler wird als {0} für die Runde gewählt.`,
    roomInstructionParagraph1Guesser: `Rater`,
    roomInstructionParagraph2: `Allen anderen Spielern wird das Wort für diese Runde präsentiert und sie müssen einen {0} für den Rater aussprechen. Der Hinweis kann nur ein einzelnes Wort sein!`,
    roomInstructionParagraph2Hint: `Hinweis`,
    roomInstructionParagraph3: `Sobald alle Spieler ihre Hinweise abgegeben haben, muss der Rater für diese Runde {0}.`,
    roomInstructionParagraph3FigureWord: `das Wort herausfinden`,
    roomInstructionParagraph4: `Aber es gibt ein {0}! Hinweise müssen {1} sein. Sobald zwei oder mehr Spieler den gleichen Hinweis abgeben, kann es dem Rater nicht helfen, das Wort zu finden! Denkt also {2}, um sicherzustellen, dass der Rater das Wort findet!`,
    roomInstructionParagraph4Twist: `Haken`,
    roomInstructionParagraph4Unique: `einzigartig`,
    roomInstructionParagraph4OutsideTheBox: `außerhalb der Kiste`,
    gameButtonPauseGame: `Spiel pausieren`,
    gameButtonLeaveGame: `Spiel verlassen`,
    gameUsername: `Benutzername`,
    gameRoom: `Raum`,
    gamePoints: `Punkte`,
    gameRound: `Runde`,
    notStartedTitle: `Nicht Gestartet`,
    notStartedHintText1: `Es braucht mindestens 3 Spieler, um das Spiel zu beginnen!`,
    notStartedButtonStartGame: `Spiel starten`,
    notStartedHintText2: `Warte auf den Admin, um das Spiel zu starten!`,
    notStartedConfigGuessingTime: `Ratezeit`,
    notStartedConfigNumRounds: `Anzahl der Runden`,
    notStartedConfigDataset: `Datensatz`,
    notStartedConfigure: `Spiel konfigurieren`,
    selectingTitle: `Wort auswählen`,
    selectingButtonWordSelect: `Wort {0}`,
    selectingHintText1: ` wählt eine Nummer aus.`,
    selectingHintText2: `Wörter hinter den Zahlen:`,
    thinkingTitle: `Hinweise abgeben`,
    thinkingHintText1: `Das Wort in dieser Runde lautet: `,
    thinkingHintText2: `Du hast {submittedWordByUser} für diese Runde abgegeben!`,
    thinkingHintText3: `Warte darauf, dass andere Spieler ihre Worte einreichen.`,
    thinkingHintText4: ` Niemand anderes hat bereits ein Wort abgegeben. | hat bereits ein Wort abgegeben. | haben bereits ein Wort abgegeben.`,
    thinkingErrorEmptyWord: `Hinweis kann nicht leer sein!`,
    thinkingErrorHintEqualGuess: `Kann das zu erratende Wort nicht als Hinweis wählen!`,
    thinkingErrorMultipleWords: `Hinweise können nur ein Wort sein!`,
    thinkingButtonSubmitWord: `Wort abschicken`,
    guessingTitle: `Wort erraten`,
    guessingHintText1: `versucht das das Wort zu erraten.`,
    guessingHintText2: `Das Wort in dieser Runde lautet: `,
    guessingHintsTitle: `Hinweise:`,
    guessingHintsSameWord: ` hatten die gleiche Idee`,
    guessingYouHave: `Du hast`,
    guessingGuessesLeft: `Versuche übrig.`,
    guessingButtonSubmit: `Wort erraten`,
    guessingHas: `hat`,
    guessingGuessesSoFar: `Bisherige Vermutungen:`,
    guessingErrorEmptyWord: `Wort kann nicht leer sein!`,
    guessingCloseToSolution1: `Du bist nah an der Lösung!`,
    guessingCloseToSolution2: `ist nah an der Lösung!`,
    roundFinishedTitle: `Runde beendet`,
    roundFinishedWordWas: `Das zu erratende Wort war:`,
    roundFinishedGuesses: `Vermutungen: `,
    roundFinishedPoints: `Punkte`,
    roundFinishedButtonStartNextRound: `Nächste Runde starten`,
    roundFinishedButtonFinishGame: `Spiel beenden`,
    gameFinishedTitle: `Spiel beendet`,
    gameFinishedTotalPoints: `Gesamtpunkte:`,
    gameFinishedHintText1: `Es sind mindestens 3 Spieler erforderlich, um ein neues Spiel zu beginnen.`,
    gameFinishedButtonStartGame: `Neues Spiel beginnen`,
    gameFinishedHintText2: `Warte auf den Admin, um ein neues Spiel zu starten!`,
    pauseTitle: `Spiel pausiert!`,
    pauseHintText1: `Es müssen mindestens 3 Spieler verbunden sein!`,
    pauseButtonUnpauseGame: `Spiel fortsetzen`,
    pauseHintText2: `Bitte warte, bis der Admin das Spiel fortsetzt`,
    userlistTitle: `Spieler`,
    userlistDisconnected: `nicht verbunden`,
    userlistAdmin: `Admin`,
    userlistActivePlayer: `Rater`,
    userListYou: `(Du)`,
    invitationLinkCopied: `Einladungslink kopiert`
  }
}

Vue.use(VueI18n);

const browserLang = localStorage.getItem('locale') || navigator.language || (navigator as any).userLanguage;
const userLang = browserLang.startsWith('de') ? 'de' : 'en';

export default new VueI18n({
  locale: userLang,
  fallbackLocale: 'en',
  messages: messages,
});
