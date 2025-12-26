import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "guest_session_id";

export const getGuestSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${uuidv4()}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

export const clearGuestSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
