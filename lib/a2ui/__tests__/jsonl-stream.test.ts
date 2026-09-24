import { describe, expect, it } from 'vitest';

import {
  consumeA2UIJsonl,
  createA2UIJsonlAccumulator,
  toFinalA2UIMessages,
  toRenderableA2UIMessages,
} from '../jsonl-stream';

const surfaceUpdate = (text: string) => JSON.stringify({
  surfaceUpdate: {
    surfaceId: 'main',
    components: [
      { id: 'root', component: { Text: { text } } },
    ],
  },
});

const beginRendering = JSON.stringify({
  beginRendering: { surfaceId: 'main', root: 'root' },
});

describe('A2UI JSONL stream transport', () => {
  it('buffers split events and renders only after beginRendering', () => {
    const firstHalf = surfaceUpdate('hello').slice(0, 30);
    const secondHalf = surfaceUpdate('hello').slice(30);

    let stream = consumeA2UIJsonl(createA2UIJsonlAccumulator(), firstHalf);
    expect(stream.acceptedEvents).toBe(0);
    expect(toRenderableA2UIMessages(stream)).toEqual([]);

    stream = consumeA2UIJsonl(stream, `${secondHalf}\n${beginRendering}\n`);
    expect(stream.acceptedEvents).toBe(2);
    expect(toRenderableA2UIMessages(stream)[0]).toMatchObject({
      surfaceUpdate: {
        surfaceId: 'main',
        components: [{ id: 'root', component: { Text: { text: 'hello' } } }],
      },
      beginRendering: true,
    });
  });

  it('reconciles later component updates by stable component id', () => {
    let stream = consumeA2UIJsonl(
      createA2UIJsonlAccumulator(),
      `${surfaceUpdate('first')}\n${beginRendering}\n`,
    );
    stream = consumeA2UIJsonl(stream, `${surfaceUpdate('second')}\n`);

    expect(toRenderableA2UIMessages(stream)[0].surfaceUpdate?.components).toEqual([
      { id: 'root', component: { Text: { text: 'second' } } },
    ]);
  });

  it('flushes a valid trailing event without a newline', () => {
    const stream = consumeA2UIJsonl(
      createA2UIJsonlAccumulator(),
      surfaceUpdate('done'),
      { flush: true },
    );

    expect(stream.acceptedEvents).toBe(1);
    expect(stream.buffer).toBe('');
  });

  it('recovers a normalized surface at EOF when beginRendering is omitted', () => {
    const stream = consumeA2UIJsonl(
      createA2UIJsonlAccumulator(),
      surfaceUpdate('still useful'),
      { flush: true },
    );

    expect(toRenderableA2UIMessages(stream)).toEqual([]);
    expect(toFinalA2UIMessages(stream)[0]).toMatchObject({
      surfaceUpdate: {
        surfaceId: 'main',
        components: [{ id: 'root', component: { Text: { text: 'still useful' } } }],
      },
      beginRendering: true,
    });
  });

  it('keeps accepted state when a later event is malformed', () => {
    let stream = consumeA2UIJsonl(
      createA2UIJsonlAccumulator(),
      `${surfaceUpdate('safe')}\n${beginRendering}\n`,
    );
    stream = consumeA2UIJsonl(stream, '{"surfaceUpdate":\n', { flush: true });

    expect(stream.errors).toEqual([
      expect.objectContaining({ code: 'invalid-json' }),
    ]);
    expect(toRenderableA2UIMessages(stream)[0].surfaceUpdate?.components[0])
      .toMatchObject({ component: { Text: { text: 'safe' } } });
  });
});
