export enum SocketEventNames {
  JOIN_ROOM = ">join_room",
  START_GAME = ">start_game",
  START_NEXT_ROUND = ">start_next_round",
  SUBMIT_WORD = ">submit_word",
  SUBMIT_GUESS = ">submit_guess",
  UPDATE_GAME_STATE = "<update_game_state",
  USERNAME_CHANGED = "<update_username",
}
