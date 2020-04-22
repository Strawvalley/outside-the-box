export enum UpdateTrigger {
  USER_JOINED_ROOM = "USER_JOINED_ROOM",
  USER_LEFT_ROOM = "USER_LEFT_ROOM",
  INITIATED_NEW_ROUND = "INITIATED_NEW_ROUND",
  TIME_RAN_OUT = "TIME_RAN_OUT",
  USER_SELECTED_WORD = "USER_SELECTED_WORD",
  USER_SUBMITTED_WORD = "USER_SUBMITTED_WORD",
  USER_SUBMITTED_GUESS = "USER_SUBMITTED_GUESS",
  USER_GUESSED_WORD = "USER_GUESSED_WORD",
  USER_USED_ALL_GUESSES = "USER_USED_ALL_GUESSES",
  PAUSED_GAME = "PAUSED_GAME",
  UNPAUSED_GAME = "UNPAUSED_GAME",
  FINISHED_GAME = "FINISHED_GAME"
}