import type { A2UIMessage } from './types';
import type {
  A2UIStreamError,
  A2UIStreamState,
} from './stream-normalizer';
import {
  applyA2UIStreamEvent,
  createA2UIStreamState,
  toA2UIMessage,
} from './stream-normalizer';

const MAX_PENDING_EVENT_CHARS = 256 * 1024;
const MAX_REPORTED_ERRORS = 20;

export interface A2UIJsonlAccumulator {
  buffer: string;
  state: A2UIStreamState;
  acceptedEvents: number;
  errors: readonly A2UIStreamError[];
}

export interface ConsumeA2UIJsonlOptions {
  /** Process a final line that does not end in a newline. */
  flush?: boolean;
}

export function createA2UIJsonlAccumulator(): A2UIJsonlAccumulator {
  return {
    buffer: '',
    state: createA2UIStreamState(),
    acceptedEvents: 0,
    errors: [],
  };
}

function appendError(
  errors: readonly A2UIStreamError[],
  error: A2UIStreamError,
): readonly A2UIStreamError[] {
  return errors.length >= MAX_REPORTED_ERRORS ? errors : [...errors, error];
}

/**
 * Consume arbitrary text chunks from an A2UI JSONL response. Only complete
 * newline-delimited events are applied; a split event remains buffered until
 * the rest arrives. Invalid events never mutate the previously accepted state.
 */
export function consumeA2UIJsonl(
  accumulator: A2UIJsonlAccumulator,
  chunk: string,
  options: ConsumeA2UIJsonlOptions = {},
): A2UIJsonlAccumulator {
  const pending = accumulator.buffer + chunk;
  const lines = pending.split(/\r?\n/);
  let buffer = lines.pop() ?? '';

  if (options.flush && buffer.trim()) {
    lines.push(buffer);
    buffer = '';
  }

  let state = accumulator.state;
  let acceptedEvents = accumulator.acceptedEvents;
  let errors = accumulator.errors;

  for (const line of lines) {
    const event = line.trim();
    if (!event) continue;

    const result = applyA2UIStreamEvent(state, event);
    if ('error' in result) {
      errors = appendError(errors, result.error);
    } else {
      state = result.state;
      acceptedEvents += 1;
    }
  }

  if (buffer.length > MAX_PENDING_EVENT_CHARS) {
    errors = appendError(errors, {
      code: 'event-too-large',
      message: 'Buffered A2UI event exceeds 256 KiB',
    });
    buffer = '';
  }

  return { buffer, state, acceptedEvents, errors };
}

/** Return only surfaces that have received a valid beginRendering event. */
export function toRenderableA2UIMessages(
  accumulator: A2UIJsonlAccumulator,
): A2UIMessage[] {
  return accumulator.state.surfaces
    .filter((surface) => surface.ready)
    .map(toA2UIMessage);
}

/**
 * Finish a completed transport without discarding valid component updates when
 * a provider omits beginRendering. While bytes are still arriving we retain
 * the stricter readiness gate; at EOF a non-empty, already-normalized surface
 * is safe to hand to Generous' complete-message renderer.
 */
export function toFinalA2UIMessages(
  accumulator: A2UIJsonlAccumulator,
): A2UIMessage[] {
  return accumulator.state.surfaces
    .filter((surface) => surface.components.length > 0)
    .map((surface) => surface.ready
      ? toA2UIMessage(surface)
      : {
          surfaceUpdate: {
            surfaceId: surface.surfaceId,
            components: surface.components.slice(),
          },
          beginRendering: true,
        });
}
