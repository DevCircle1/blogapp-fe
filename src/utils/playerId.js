import { v4 as uuidv4 } from "uuid";
const PLAYER_ID_KEY = "daily_wordle_player_id";
export const getPlayerId = () => {
  let playerId = localStorage.getItem(PLAYER_ID_KEY);
  if (!playerId) {
    playerId = uuidv4();
    localStorage.setItem(PLAYER_ID_KEY, playerId);
  }
  return playerId;
};