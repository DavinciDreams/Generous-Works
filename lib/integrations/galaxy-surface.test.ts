import { describe, expect, it } from 'vitest';
import type { SurfaceUpdate } from '@/lib/a2ui/types';

import {
  GalaxySurfaceContractError,
  deriveGalaxySurfaceTitle,
  galaxySurfaceToMessageContent,
  toReplayableA2UIMessage,
  toGalaxySurfaceSpec,
} from './galaxy-surface';

const researchBoard = (): { surfaceUpdate: SurfaceUpdate } => ({
  surfaceUpdate: {
    surfaceId: 'research-board',
    components: [
      {
        id: 'board-title',
        component: { Title: { text: 'Research Board' } },
      },
      {
        id: 'experiment-table',
        component: {
          DataTable: {
            data: {
              title: 'Experiments',
              columns: [{ id: 'title', header: 'Experiment', accessorKey: 'title' }],
              rows: [{ title: 'Parser reliability' }],
            },
          },
        },
      },
    ],
  },
});

describe('Galaxy surface contract', () => {
  it('converts the bounded Research Board fixture', () => {
    const message = researchBoard();
    const spec = toGalaxySurfaceSpec(message);

    expect(spec.schema).toBe('gb.surface.v1');
    expect(spec.catalog).toEqual({ id: 'generous.a2ui', version: '1' });
    expect(spec.bindings).toEqual([]);
    expect(deriveGalaxySurfaceTitle(message)).toBe('Research Board');
  });

  it('rejects arbitrary JSX components and action props', () => {
    const jsx = researchBoard();
    jsx.surfaceUpdate.components[0].component = { JSX: { code: '<Card />' } };
    expect(() => toGalaxySurfaceSpec(jsx)).toThrow(GalaxySurfaceContractError);

    const action = researchBoard();
    action.surfaceUpdate.components[0].component = {
      Card: { onClick: 'deleteEverything' },
    };
    expect(() => toGalaxySurfaceSpec(action)).toThrow(/not allowed/);
  });

  it('rejects prototype-pollution keys at any property depth', () => {
    const polluted = researchBoard();
    polluted.surfaceUpdate.components[0].component = {
      Card: JSON.parse('{"data":{"__proto__":{"polluted":true}}}'),
    };
    expect(() => toGalaxySurfaceSpec(polluted)).toThrow(/not allowed/);

    const constructor = researchBoard();
    constructor.surfaceUpdate.components[0].component = {
      Card: { data: { constructor: { prototype: { polluted: true } } } },
    };
    expect(() => toGalaxySurfaceSpec(constructor)).toThrow(/not allowed/);
  });

  it('rejects stale references, cycles, and non-finite data', () => {
    const missing = researchBoard();
    missing.surfaceUpdate.components[0].children = ['missing'];
    expect(() => toGalaxySurfaceSpec(missing)).toThrow(/unknown child/);

    const cycle = researchBoard();
    cycle.surfaceUpdate.components[0].children = ['experiment-table'];
    cycle.surfaceUpdate.components[1].children = ['board-title'];
    expect(() => toGalaxySurfaceSpec(cycle)).toThrow(/cycle/);

    const invalidNumber = researchBoard();
    invalidNumber.surfaceUpdate.components[0].component = { Card: { score: Infinity } };
    expect(() => toGalaxySurfaceSpec(invalidNumber)).toThrow(/non-finite/);
  });

  it('revalidates the schema, catalog, and components before replay', () => {
    const stored = toGalaxySurfaceSpec(researchBoard());
    expect(toReplayableA2UIMessage(stored)).toEqual({
      surfaceUpdate: stored.surfaceUpdate,
    });
    expect(galaxySurfaceToMessageContent(stored)).toContain('```json');

    expect(() => toReplayableA2UIMessage({ ...stored, schema: 'gb.surface.v0' })).toThrow(
      /unsupported schema or catalog/,
    );
    const unsafe = structuredClone(stored);
    unsafe.surfaceUpdate.components[0].component = { JSX: { code: '<Card />' } };
    expect(() => toReplayableA2UIMessage(unsafe)).toThrow(/not approved/);
  });
});
