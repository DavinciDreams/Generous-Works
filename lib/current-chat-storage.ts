/**
 * Browser copies of the conversation on screen, so a reload doesn't lose it.
 *
 * Each copy is keyed by the signed-in user, so one person's conversation is
 * never shown to the next person on the same browser. Every tab keeps its own
 * copy in sessionStorage, so reloading a tab brings back that tab's
 * conversation; the most recently saved one also goes to localStorage, so a new
 * tab or a restarted browser can pick it up.
 *
 * Writes only happen at explicit checkpoints (a response finished, a chat was
 * opened, the page was hidden), never per streamed chunk.
 */

import type { Message } from './store';

const KEY_PREFIX = 'generous-current-chat:';
const FORMAT_VERSION = 2;

export interface CurrentChat {
  /** Postgres chat id the conversation is saved under from History. */
  chatId: string;
  messages: Message[];
}

const keyFor = (userId: string) => `${KEY_PREFIX}${userId}`;

function isStoredMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return typeof message.id === 'string'
    && typeof message.content === 'string'
    && (message.role === 'user' || message.role === 'assistant' || message.role === 'system');
}

function parse(raw: string | null): CurrentChat | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as { version?: unknown; chatId?: unknown; messages?: unknown } | null;
    if (value?.version !== FORMAT_VERSION || typeof value.chatId !== 'string') return null;
    const { messages } = value;
    if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isStoredMessage)) return null;
    return { chatId: value.chatId, messages };
  } catch {
    return null;
  }
}

function read(storage: Storage | undefined, userId: string): CurrentChat | null {
  try {
    return parse(storage?.getItem(keyFor(userId)) ?? null);
  } catch {
    return null;
  }
}

function remove(storage: Storage | undefined, key: string) {
  try {
    storage?.removeItem(key);
  } catch {
    // Storage is unavailable.
  }
}

const sessionStore = () => (typeof window === 'undefined' ? undefined : window.sessionStorage);
const localStore = () => (typeof window === 'undefined' ? undefined : window.localStorage);

/** This tab's conversation if it has one, otherwise the user's most recent one. */
export function readCurrentChat(userId: string): CurrentChat | null {
  return read(sessionStore(), userId) ?? read(localStore(), userId);
}

/** Saves the conversation for this tab and as the user's most recent one. */
export function writeCurrentChat(userId: string, chat: CurrentChat) {
  const key = keyFor(userId);
  const value = JSON.stringify({ version: FORMAT_VERSION, ...chat });
  for (const storage of [sessionStore(), localStore()]) {
    try {
      storage?.setItem(key, value);
    } catch {
      // Storage is full or blocked: drop the older copy so a reload doesn't
      // bring back a stale conversation. History in Postgres is unaffected.
      remove(storage, key);
    }
  }
}

/**
 * Forgets this tab's conversation. The shared copy is only removed when it is
 * the same chat, so another tab's newer conversation survives.
 */
export function clearCurrentChat(userId: string, chatId: string | null) {
  const key = keyFor(userId);
  remove(sessionStore(), key);
  if (chatId && read(localStore(), userId)?.chatId === chatId) {
    remove(localStore(), key);
  }
}

/** Removes every user's copies; used when nobody is signed in. */
export function clearAllCurrentChats() {
  for (const storage of [sessionStore(), localStore()]) {
    try {
      if (!storage) continue;
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(KEY_PREFIX)) keys.push(key);
      }
      keys.forEach((key) => remove(storage, key));
    } catch {
      // Storage is unavailable.
    }
  }
}
