import { describe, expect, it } from 'vitest';

import {
  applyA2UICompleteMessage,
  applyA2UIStreamEvent,
  createA2UIStreamState,
  findA2UISurface,
  toA2UIMessage,
} from '../stream-normalizer';

const component = (id: string, text: string) => ({
  id,
  component: { Text: { text: { literalString: text } } },
});

function applyOk(
  state: ReturnType<typeof createA2UIStreamState>,
  event: unknown,
) {
  const result = applyA2UIStreamEvent(state, event);
  expect(result.ok).toBe(true);
  if (result.ok === false) throw new Error(result.error.message);
  return result;
}

describe('A2UI stream normalizer', () => {
  it('buffers component updates by surface and stable component ID', () => {
    let state = createA2UIStreamState();
    state = applyOk(state, {
      surfaceUpdate: { surfaceId: 'main', components: [component('root', 'first')] },
    }).state;
    state = applyOk(state, {
      surfaceUpdate: {
        surfaceId: 'main',
        components: [component('root', 'replacement'), component('detail', 'new')],
      },
    }).state;
    state = applyOk(state, {
      surfaceUpdate: { surfaceId: 'sidebar', components: [component('root', 'side')] },
    }).state;

    expect(findA2UISurface(state, 'main')).toMatchObject({
      ready: false,
      components: [
        { id: 'root', component: { Text: { text: { literalString: 'replacement' } } } },
        { id: 'detail' },
      ],
    });
    expect(findA2UISurface(state, 'sidebar')?.components).toHaveLength(1);
  });

  it('normalizes typed data updates and renders only after beginRendering', () => {
    let state = createA2UIStreamState();
    state = applyOk(state, {
      surfaceUpdate: { surfaceId: 'main', components: [component('root', 'hello')] },
    }).state;
    state = applyOk(state, {
      dataModelUpdate: {
        surfaceId: 'main',
        path: '/user',
        contents: [
          { key: 'name', valueString: 'Ada' },
          { key: 'active', value: { valueBoolean: true } },
          {
            key: 'address',
            valueMap: [{ key: 'city', valueString: 'London' }],
          },
        ],
      },
    }).state;
    state = applyOk(state, {
      beginRendering: { surfaceId: 'main', root: 'root', catalogId: 'generous.a2ui' },
    }).state;

    const surface = findA2UISurface(state, 'main');
    expect(surface).toMatchObject({
      ready: true,
      rootId: 'root',
      catalogId: 'generous.a2ui',
      dataModel: {
        user: { name: 'Ada', active: true, address: { city: 'London' } },
      },
    });
  });

  it('treats immediate duplicates as no-ops but permits A-to-B-to-A restoration', () => {
    const updateA = {
      surfaceUpdate: { surfaceId: 'main', components: [component('root', 'hello')] },
    };
    const first = applyOk(createA2UIStreamState(), updateA);
    const immediateDuplicate = applyA2UIStreamEvent(first.state, {
      surfaceUpdate: { components: [component('root', 'hello')], surfaceId: 'main' },
    });
    expect(immediateDuplicate).toMatchObject({ ok: true, duplicate: true });
    expect(immediateDuplicate.state).toBe(first.state);

    const updateB = applyOk(first.state, {
      surfaceUpdate: { surfaceId: 'main', components: [component('root', 'goodbye')] },
    });
    const restoredA = applyOk(updateB.state, updateA);

    expect(restoredA.duplicate).toBe(false);
    expect(findA2UISurface(restoredA.state, 'main')).toMatchObject({
      revision: 3,
      components: [{ component: { Text: { text: { literalString: 'hello' } } } }],
    });
  });

  it('returns errors without overwriting the last valid state', () => {
    const valid = applyOk(createA2UIStreamState(), {
      surfaceUpdate: { surfaceId: 'main', components: [component('root', 'safe')] },
    });
    const malformedJson = applyA2UIStreamEvent(valid.state, '{"surfaceUpdate":');
    const malformedComponent = applyA2UIStreamEvent(valid.state, {
      surfaceUpdate: {
        surfaceId: 'main',
        components: [{ id: 'root', component: { Text: {}, Button: {} } }],
      },
    });
    const unsafe = applyA2UIStreamEvent(valid.state, JSON.parse(
      '{"dataModelUpdate":{"surfaceId":"main","path":"/","contents":[{"key":"__proto__","valueString":"bad"}]}}',
    ));
    const invalidAfterValidUpdate = applyA2UIStreamEvent(valid.state, {
      surfaceUpdate: { surfaceId: 'main', components: [component('root', 'must not leak')] },
      beginRendering: { surfaceId: 'main', root: 'missing-root' },
    });

    for (const result of [malformedJson, malformedComponent, unsafe, invalidAfterValidUpdate]) {
      expect(result.ok).toBe(false);
      expect(result.state).toBe(valid.state);
      expect(findA2UISurface(result.state, 'main')?.components[0]).toEqual(component('root', 'safe'));
    }
  });

  it('applies a legacy complete message atomically and infers readiness', () => {
    const result = applyA2UICompleteMessage(createA2UIStreamState(), {
      surfaceUpdate: { components: [component('legacy-root', 'complete')] },
      dataModelUpdate: { path: '/stats', value: { count: 3 }, operation: 'set' },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const surface = findA2UISurface(result.state);
    expect(surface).toMatchObject({
      ready: true,
      rootId: 'legacy-root',
      dataModel: { stats: { count: 3 } },
    });
    expect(toA2UIMessage(surface!)).toMatchObject({
      surfaceUpdate: { surfaceId: '@default', components: [{ id: 'legacy-root' }] },
      beginRendering: true,
    });
  });

  it('does not interpret actions or accept client-to-server messages', () => {
    const state = createA2UIStreamState();
    const result = applyA2UIStreamEvent(state, {
      userAction: { name: 'delete_everything', surfaceId: 'main' },
    });

    expect(result).toMatchObject({
      ok: false,
      state,
      error: { code: 'invalid-event' },
    });
  });

  it('bounds surface, component, value, and input sizes', () => {
    const tooManyComponents = Array.from({ length: 257 }, (_, index) => component(`c-${index}`, 'x'));
    expect(applyA2UIStreamEvent(createA2UIStreamState(), {
      surfaceUpdate: { components: tooManyComponents },
    })).toMatchObject({ ok: false, error: { code: 'limit-exceeded' } });

    expect(applyA2UIStreamEvent(createA2UIStreamState(), ' '.repeat(256 * 1024 + 1)))
      .toMatchObject({ ok: false, error: { code: 'event-too-large' } });

    expect(applyA2UIStreamEvent(createA2UIStreamState(), {
      dataModelUpdate: {
        path: '/large',
        value: Array.from({ length: 5 }, () => 'x'.repeat(60 * 1024)),
      },
    })).toMatchObject({ ok: false, error: { code: 'limit-exceeded' } });
  });
});
