export const AI_CHAT_STORAGE_KEY = "devportfolio-ai-conversations";
const LEGACY_STORAGE_KEY = "devportfolio-ai-chat";

export function clearChatHistory() {
  try {
    localStorage.removeItem(AI_CHAT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {}
}
