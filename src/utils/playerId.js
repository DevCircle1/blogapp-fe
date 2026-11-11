import { v4 as uuidv4 } from "uuid";
const PLAYER_ID_KEY = "daily_wordle_player_id";
// The visitor's anonymous id. Empty during the server render, where there is no localStorage;
// callers only use it inside effects and handlers.
export const getPlayerId = () => {
  if (typeof localStorage === 'undefined') return '';
  let playerId = localStorage.getItem(PLAYER_ID_KEY);
  if (!playerId) {
    playerId = uuidv4();
    localStorage.setItem(PLAYER_ID_KEY, playerId);
  }
  return playerId;
};